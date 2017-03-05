import { Component, OnInit, OnDestroy } from '@angular/core';

import { Functionals as F } from "../../Framework/Functionals";
import * as FM from "../../Admin/Facts/FactModel";
import * as QTM from "../../admin/QuizTemplates/QT.Model";
import * as QIM from "./QIModel";
import { ConsoleLog } from "../../Framework/Logging/ConsoleLogService";
import { QuizTemplatesService } from "../../Admin/QuizTemplates/QT.Service";
import { FactsService } from "../../admin/Facts/Facts.Service";

interface qiParameters {
    totalQuestions: number;
    difficulty: number;
}

interface qiRouteParameters {
    quizTemplateID: string;
}

interface IQAPair {
    question: FM.IQuestion;
    Answers: FM.ICorrectAnswer[];
    WrongAnswers: FM.IWrongAnswer[];
}

interface IQuizQuestionChoiceSet {
    Response: string;
    IsCorrect: boolean;
    WasSelectedByUser: boolean;
}
interface IQuizQuestion {
    Question: string;
    AllChoices: IQuizQuestionChoiceSet[]
}


@Component({
    templateUrl: 'app/EndUser/QuizInstance.html',
    selector: 'jtfj-qi-crud-component'
})
export class QuizInstanceCrudController {

    private _quizTemplate: QTM.QuizTemplateItem; // populated by constructor using $routeParams value

    private _quizInstance: QIM.QuizInstanceItem;
    private _quizParameters: qiParameters;

    private _allQuizQuestions: IQuizQuestion[];
    public get AllQuizQuestions() { return this._allQuizQuestions; }

    private _currentQuizQuestion: IQuizQuestion;
    public get CurrentQuizQuestion() { return this._currentQuizQuestion; }

    private _currentQuizQuestionIndex: number = 0;
    public get CurrentQuizQuestionIndex() { return this._currentQuizQuestionIndex; }

    private _quizTemplatePromise: Promise<QTM.IQuizTemplateItem>;

    constructor(private clog: ConsoleLog,
        private $routeParams: qiRouteParameters,
        private _quizTemplatesService: QuizTemplatesService,
        private _factsService: FactsService
    ) {

        this.clog.debug(`QuizInstanceCrudController: ctor: Entering, $routeParams:`, this.$routeParams);

        this._quizTemplatePromise = this._quizTemplatesService.getQuizTemplateByUniqueID(this.$routeParams.quizTemplateID);

        this._initializeQuizInstance({
            totalQuestions: 10, difficulty: 99
        });

    } // constructor

    private _initializeQuizInstance(quizParams: qiParameters) {

        this.clog.debug(`QuizInstanceController: _initializeQuizInstance: Entering.`);

        // to initialize this, we need to go through the template and pick out a number of questions to ask

        this._quizTemplatePromise.then(
            (result) => {
                this._quizTemplate = result;

                this._allQuizQuestions = this._createRandomizedQuiz(quizParams);

                this._currentQuizQuestion = this._allQuizQuestions[0];
                this._currentQuizQuestionIndex = 0;

                this.clog.debug(`QuizInstanceController: random questions:`, this._createRandomizedQuiz(quizParams));

            },
            (errorDetails) => {
            }
        );

    }

    public HandleNextQuestion(): void {

        this._currentQuizQuestionIndex += 1;

        if (this._currentQuizQuestionIndex > this._allQuizQuestions.length) {
            this._currentQuizQuestionIndex = this._allQuizQuestions.length;
            return;
        }

        this._currentQuizQuestion = this._allQuizQuestions[this._currentQuizQuestionIndex];

    }

    public HandlePreviousQuestion(): void {

        this._currentQuizQuestionIndex -= 1;

        if (this._currentQuizQuestionIndex < 0) {
            this._currentQuizQuestionIndex = 0;
            return;
        }

        this._currentQuizQuestion = this._allQuizQuestions[this._currentQuizQuestionIndex];

    }

    private _createRandomizedQuiz(quizParams: qiParameters): IQuizQuestion[] {

        // Build a pool of all the available questions and answers
        const qaPool = this._quizTemplate.Facts.reduce((allQAPairs: IQAPair[], aFact: FM.IFactItem) => {
            const results = aFact.Questions.map((aQuestion) => {
                return <IQAPair>{
                    question: aQuestion,
                    Answers: F.getShuffledArray(aFact.CorrectAnswers),
                    WrongAnswers: F.getShuffledArray(aFact.WrongAnswers)
                };
            });

            return allQAPairs.concat(results);

        }, [])

        const selectedQuestions = F.getShuffledArray(qaPool).slice(0, quizParams.totalQuestions);

        const finalizedQuizQuestions = selectedQuestions.map((aSelectedQuestion) => {
            return <IQuizQuestion>{
                Question: aSelectedQuestion.question.Question,
                AllChoices: F.getShuffledArray([].concat(
                    <IQuizQuestionChoiceSet>{
                        IsCorrect: true,
                        Response: aSelectedQuestion.Answers[0].CorrectAnswer,
                        WasSelectedByUser: false
                    }).
                    concat(aSelectedQuestion.WrongAnswers.map(
                        (aWrongAnswer) => {
                            return <IQuizQuestionChoiceSet>{
                                Response: aWrongAnswer.WrongAnswer,
                                IsCorrect: false,
                                WasSelectedByUser: false
                            }
                        })))
            }
        });

        return finalizedQuizQuestions;
    }

    public Ping(): void {
        this.clog.debug(`QuizInstanceController: Ping: Ping!`);
        this._quizTemplatesService.ping();
    }

    private _returnToQuizInstanceList() {

        //this.$location.path("/Admin/QuizInstances");
    }


}

