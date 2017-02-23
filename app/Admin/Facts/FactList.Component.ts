import { Component, OnInit } from '@angular/core';

import { FactItem } from "./FactItem";
import { FactsService } from "../Facts/Facts.Service";
import { Functionals as F } from "../../Framework/Functionals";
import { ConsoleLog } from "../../Framework/Logging/ConsoleLogService";
import { KnowledgeDomainItem } from "../KnowledgeDomains/KDItem";

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

    public GetFriendlyKDDisplay(forDomains: KnowledgeDomainItem[]) {
        return F.stringArrayToCdl(F.extractFieldsFromCollection<string[]>(forDomains, "Title"));
    }

}
