import { Component, OnInit } from '@angular/core';
import { Functionals } from "../../Framework/Functionals";
import { QuizTemplatesService } from "./QT.Service";
import { ConsoleLog } from "../../Framework/Logging/ConsoleLogService";
import * as KDM from "../KnowledgeDomains/KDItem";

@Component({
    selector: 'jtfj-quiz-templates',
    templateUrl: `app/Admin/QuizTempolates/QTList.View.html`,
})
export class QuizTemplatesController {

    public get AllQuizTemplates() { return this._quizTemplatesService.AllQuizTemplates; }

    constructor(private clog: ConsoleLog,
        private _quizTemplatesService: QuizTemplatesService) {

        this.clog.debug(`QuizTemplatesController: ctor: Entering.`);

        this._quizTemplatesService.LoadAll().then(
            (results) => {
                this.clog.debug(`ListQuizTemplateController: Loaded quiz templates:`, this.AllQuizTemplates);
            },
            (errorDetails) => {
            }
        );

    } // constructor

    public Ping(): void {
        this._quizTemplatesService.ping();
    }

    /**
     * Returns a comma delimited list of knowledge domains suitable for rendering on the UI.
     * @param forDomains: array of knowledge domain items.
     */
    public GetFriendlyKDDisplay(forDomains: KDM.KnowledgeDomainItem[]) {

        return Functionals.stringArrayToCdl(Functionals.extractFieldsFromCollection<string[]>(forDomains, "Title"));
    }
}

