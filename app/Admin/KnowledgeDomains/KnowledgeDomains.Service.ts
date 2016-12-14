
import { Functionals } from '../../Framework/Functionals';
import { AbstractAngularService } from "../../Framework/AbstractAngularService";
import { RecordIDsService } from "../../DataServices/RecordIDsService";
import { KnowledgeDomainItem } from "./KnowledgeDomainItem";

import { Injectable } from '@angular/core';

"use strict";

@Injectable()
export class KnowledgeDomainsService extends AbstractAngularService {

    private _allKnowledgeDomains: KnowledgeDomainItem[];
    public get AllKnowledgeDomains() { return this._allKnowledgeDomains; }

    constructor(private _recordIDsService: RecordIDsService) {

        super();

    }

    public Ping() {
        console.debug(`KnowledgeDomainsService: got a ping, pinging your right back.`);
        this._loadAllKnowledgeDomains();
    }

    public GetKnowledgeDomains() {
        return this._loadAllKnowledgeDomains();
    }

    public GetKnowledgeDomainItemByID(theId: string) {
        return Functionals.getEntityByUniqueID<KnowledgeDomainItem>(theId, this._allKnowledgeDomains);
    }

    private _persistKnowledgeDomains() {
        localStorage.setItem("knowledgedomains", JSON.stringify(this._allKnowledgeDomains));
    }

    public DeleteKnowledgeDomainByID(theDomainID: string) {
        this._allKnowledgeDomains = Functionals.filterOutEntityByUniqueID(theDomainID, this._allKnowledgeDomains);
        this._persistKnowledgeDomains();
    }

    public SaveKnowledgeDomain(theDomain: KnowledgeDomainItem) {

        console.debug(`KnowledgeDomainService: Entering, will save a domain:`, { dmn: theDomain });

        if (Functionals.IsIDAssigned(theDomain)) {

            console.debug(`KnowledgeDomainService: SaveKnowledgeDomain: No ID assigned, getting one.`);

            this._recordIDsService.GetUniqueID().then(
                (recordID: string) => {
                    theDomain.UniqueID = recordID;
                    console.debug(`KnowledgeDomainService: SaveKnowledgeDomain: Got an ID:`, theDomain.UniqueID);
                    this._allKnowledgeDomains = Functionals.getMergedCollection(this._allKnowledgeDomains, theDomain);
                    this._persistKnowledgeDomains();
                }
            );
        }
        else {
            console.debug(`KnowledgeDomainService: SaveKnowledgeDomain: Already has an ID, no need to get a new one.`);
            this._allKnowledgeDomains = Functionals.getMergedCollection(this._allKnowledgeDomains, theDomain);
            this._persistKnowledgeDomains();
        }

    }

    private _loadAllKnowledgeDomains(): Promise<KnowledgeDomainItem[]> {

        return new Promise<KnowledgeDomainItem[]>((resolve, reject) => {
            this._allKnowledgeDomains = JSON.parse(localStorage.getItem("knowledgedomains"));

            this._allKnowledgeDomains = this._allKnowledgeDomains || [];

            const randomKD: KnowledgeDomainItem = new KnowledgeDomainItem();
            randomKD.Description = "my random description";
            randomKD.Title = "my random title";
            randomKD.UniqueID = "my unique id";
            this._allKnowledgeDomains = [].concat(randomKD);

            console.debug(`KnowledgeDomainService: Resolving with domains:`, this._allKnowledgeDomains);

            resolve(this._allKnowledgeDomains);

        });

    }

}
