import { Component, OnInit } from '@angular/core';

import { FactItem } from "./FactModel";
import { FactsService } from "../Facts/Facts.Service";
import { Functionals as F } from "../../Framework/Functionals";
import { ConsoleLog } from "../../Framework/Logging/ConsoleLogService";
import { KnowledgeDomainItem } from "../KnowledgeDomains/KDItem";
import * as CustomErrors from "../../Framework/ErrorHandling/ErrorsService";

@Component({
    selector: 'jtfj-facts-list',
    templateUrl: `app/Admin/Facts/FactsList.View.html`,
})
export class FactsListComponent implements OnInit {

    public get AllFacts() { return this.factsService.AllFacts; }

    constructor(
        private factsService: FactsService,
        private clog: ConsoleLog) {

        this.clog.debug(`KnowledgeDomainListController: ctor: Entering.`);

    } // constructor

    public ngOnInit() {
        this.factsService.loadAllFacts();
    }

    public getFriendlyKDDisplay(forDomains: KnowledgeDomainItem[]) {
        try {
            const result = F.stringArrayToCdl(F.extractFieldsFromCollection<string[]>(forDomains, "Title"));
            this.clog.debug(`FactsListComponent: getFriendlyKDDisplay: got a view of knowledge domains:`, result);
            return result;
        }
        catch (ex) {
            return (<CustomErrors.IError>ex)._msg;
        }
    }

}
