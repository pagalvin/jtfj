module jtfj.EndUsers.controllers {

    import interfaces = jtfj.Interfaces;
    import entities = jtfj.Entities;
    import F = jtfj.Framework.Functionals;

    interface qiParameters {
        totalQuestions: number;
        difficulty: number;
    }

    interface qiRouteParameters {
        quizTemplateID: string;
    }

    interface IQAPair {
        question: entities.IQuestion;
        Answers: entities.ICorrectAnswer[];
        WrongAnswers: entities.IWrongAnswer[];
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

    export class QuizInstanceCrudController {

        private _quizTemplate: entities.QuizTemplateItem; // populated by constructor using $routeParams value

        private _quizInstance: entities.QuizInstanceItem;
        private _quizParameters: qiParameters;

        private _allQuizQuestions: IQuizQuestion[];
        public get AllQuizQuestions() { return this._allQuizQuestions; }

        private _currentQuizQuestion: IQuizQuestion;
        public get CurrentQuizQuestion() { return this._currentQuizQuestion; }

        private _currentQuizQuestionIndex: number = 0;
        public get CurrentQuizQuestionIndex() { return this._currentQuizQuestionIndex; }

        static $inject = [
            "$q",
            "$log",
            "$routeParams",
            "$location",
            "jtfj.Framework.Services.ModalsFactoryService",
            "jtfj.Admin.Services.QuizTemplatesService",
            "jtfj.Services.FactsService"
        ];

        private _quizTemplatePromise: ng.IPromise<entities.IQuizTemplateItem>;

        constructor(private $q: ng.IQService,
            private $log: ng.ILogService,
            private $routeParams: qiRouteParameters,
            private $location: ng.ILocationService,
            private _modalService: jtfj.Framework.Services.ModalsFactoryService,
            private _quizTemplatesService: jtfj.Admin.Services.QuizTemplatesService,
            private _factsService: jtfj.Services.FactsService
        ) {

            this.$log.debug(`QuizInstanceCrudController: ctor: Entering, $routeParams:`, this.$routeParams);

            this._quizTemplatePromise = this._quizTemplatesService.GetQuizTemplateByUniqueID(this.$routeParams.quizTemplateID);

            this._initializeQuizInstance({
                totalQuestions: 10, difficulty: 99
            });

        } // constructor

        private _initializeQuizInstance(quizParams: qiParameters) {

            this.$log.debug(`QuizInstanceController: _initializeQuizInstance: Entering.`);

            // to initialize this, we need to go through the template and pick out a number of questions to ask

            this._quizTemplatePromise.then(
                (result) => {
                    this._quizTemplate = result;

                    this._allQuizQuestions = this._createRandomizedQuiz(quizParams);

                    this._currentQuizQuestion = this._allQuizQuestions[0];
                    this._currentQuizQuestionIndex = 0;

                    this.$log.debug(`QuizInstanceController: random questions:`, this._createRandomizedQuiz(quizParams));

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

        private _createRandomizedQuiz(quizParams: qiParameters): IQuizQuestion[]{

            // Build a pool of all the available questions and answers
            const qaPool = this._quizTemplate.Facts.reduce((allQAPairs: IQAPair[], aFact: entities.IFactItem) => {
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
            this.$log.debug(`QuizInstanceController: Ping: Ping!`);
            this._quizTemplatesService.Ping();
        }

        private _returnToQuizInstanceList() {
            this.$location.path("/Admin/QuizInstances");
        }


    }

    angular
        .module('jtfj')
        .controller("jtfj.Admin.controllers.QuizInstanceCrudController", QuizInstanceCrudController);
}
