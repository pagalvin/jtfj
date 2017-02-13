
import { Functionals } from '../../Framework/Functionals';
import { AbstractAngularService } from "../../Framework/AbstractAngularService";
import { RecordIDsService } from "../../DataServices/RecordIDsService";
import { KnowledgeDomainItem } from "./KDItem";

import { Injectable } from '@angular/core';

"use strict";

@Injectable()
export class KnowledgeDomainsService extends AbstractAngularService {

    private allKnowledgeDomains: KnowledgeDomainItem[];
    public get AllKnowledgeDomains() { return this.allKnowledgeDomains; }

    private kdLoadPromise: Promise<KnowledgeDomainItem[]>;

    constructor(private _recordIDsService: RecordIDsService) {

        super();
        this.kdLoadPromise = this.loadAllKnowledgeDomains();

    }

    public ping() {
        console.debug(`KnowledgeDomainsService: got a ping, pinging your right back.`);
        this.kdLoadPromise = this.loadAllKnowledgeDomains();
    }

    public getKnowledgeDomains() {
        return this.loadAllKnowledgeDomains();
    }

    public async getKnowledgeDomainItemByID(theId: string): Promise<KnowledgeDomainItem>{

        return new Promise<KnowledgeDomainItem>( (resolve, reject) => {
            this.kdLoadPromise.then( 
                (promiseResult) => {
                    console.debug(`KD.Service: Loaded all knowledge domains:`, this.allKnowledgeDomains);
                    try {
                        const result = Functionals.getEntityByUniqueID<KnowledgeDomainItem>(theId, this.allKnowledgeDomains);
                        resolve(result);
                    }
                    catch (getException) {
                        reject(getException);
                    }
            },
            (errorDetails) => {
                reject(errorDetails);
            }
        )
        });

    }

    private _persistKnowledgeDomains() {
        localStorage.setItem("knowledgedomains", JSON.stringify(this.allKnowledgeDomains));
    }

    public DeleteKnowledgeDomainByID(theDomainID: string) {
        this.allKnowledgeDomains = Functionals.filterOutEntityByUniqueID(theDomainID, this.allKnowledgeDomains);
        this._persistKnowledgeDomains();
    }

    public saveKnowledgeDomain(theDomain: KnowledgeDomainItem) {

        console.debug(`KnowledgeDomainService: Entering, will save a domain:`, { dmn: theDomain });

        console.debug(`KnowledgeDomainService: is id assigned?:`, Functionals.IsIDAssigned(theDomain));

        if (! Functionals.IsIDAssigned(theDomain)) {

            console.debug(`KnowledgeDomainService: SaveKnowledgeDomain: No ID assigned, getting one.`);

            this._recordIDsService.getUniqueID().then(
                (recordID: string) => {
                    theDomain.UniqueID = recordID;
                    console.debug(`KnowledgeDomainService: SaveKnowledgeDomain: Got an ID:`, theDomain.UniqueID);
                    this.allKnowledgeDomains = Functionals.getMergedCollection(this.allKnowledgeDomains, theDomain);
                    this._persistKnowledgeDomains();
                }
            );
        }
        else {
            console.debug(`KnowledgeDomainService: SaveKnowledgeDomain: Already has an ID, no need to get a new one.`);
            this.allKnowledgeDomains = Functionals.getMergedCollection(this.allKnowledgeDomains, theDomain);
            this._persistKnowledgeDomains();
        }

    }

    private loadAllKnowledgeDomains(): Promise<KnowledgeDomainItem[]> {

        return new Promise<KnowledgeDomainItem[]>((resolve, reject) => {
            this.allKnowledgeDomains = JSON.parse(localStorage.getItem("knowledgedomains"));

            this.allKnowledgeDomains = this.allKnowledgeDomains || [];

            const randomKD: KnowledgeDomainItem = new KnowledgeDomainItem();
            randomKD.Description = "my random description";
            randomKD.Title = "my random title";
            randomKD.UniqueID = "my unique id";
            this.allKnowledgeDomains = [].concat(randomKD);

            console.debug(`KnowledgeDomainService: Resolving with domains:`, this.allKnowledgeDomains);

            resolve(this.allKnowledgeDomains);

        });

    }

}
