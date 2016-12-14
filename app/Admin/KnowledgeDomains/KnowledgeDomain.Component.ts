import { Component } from '@angular/core';
import { KnowledgeDomainItem } from "./KnowledgeDomainItem";
import { KnowledgeDomainsService } from "./KnowledgeDomains.Service";

@Component({
    selector: 'jtfj-knowledge-domains',
    templateUrl: `app/Admin/KnowledgeDomains/ListKnowledgeDomainsView.html`,
    //C:\jtfj2\jtfj\app\Admin\KnowledgeDomains\ListKnowledgeDomainsView.html
})
export class KnowledgeDomainsListComponent {

    public get AllKnowledgeDomains(): KnowledgeDomainItem[] {
        return this._knowledgeDomainService.AllKnowledgeDomains;
    }

    private _isNewKnowledgeDomainItem: boolean = false;

    public InputTitle: string;
    public InputDescription: string;

    constructor(private _knowledgeDomainService: KnowledgeDomainsService) {

        console.debug(`KnowledgeDomainListController: ctor: Entering.`);

        this._knowledgeDomainService.GetKnowledgeDomains();

    } // constructor

    public Ping(): void {
    }

}
