import { Functionals } from '../../Framework/Functionals';
import { AbstractAngularService } from "../../Framework/AbstractAngularService";
import { RecordIDsService } from "../../DataServices/RecordIDsService";
import { IFactItem, FactItem } from "./FactItem";
import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';

import { Injectable } from '@angular/core';

"use strict";

@Injectable()
export class FactsService extends AbstractAngularService {

    private _localStorageKey: string = "AllFacts";

    private _allFacts: IFactItem[];
    public get AllFacts(): IFactItem[] { return this._allFacts; }

    private _loadAllFactsPromise: Promise<boolean>;

    constructor(
        private cLog: ConsoleLog,
        private recordsService: RecordIDsService) {

        super();

        this._loadAllFactsPromise = this.loadAllFacts();

    }

    public ping() {
        this.cLog.debug(`FactsService: got a ping, pinging your right back.`);
        this.loadAllFacts();
    }


    public LoadAllFacts() {
        return this._loadAllFactsPromise;
    }

    public async DeleteFactByUniqueID(forID: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            this._allFacts = this._allFacts.filter((anItem) => {
                return anItem.UniqueID !== forID;
            });

            resolve(this.persistFacts());
        })
    }

    // public GetFactByUniqueIDng1(forID: string): Promise<IFactItem> {

    //     this.cLog.debug(`FactsService: GetFactByID: loading a fact, [${forID}].`);

    //     this._loadAllFactsPromise.then(
    //         () => {
    //             this.cLog.debug(`FactsService: GetFactByID: all facts:`, this._allFacts);
    //             deferred.resolve(<jtfj.Entities.IFactItem>jtfj.Framework.Functionals.getEntityByUniqueID(forID, this._allFacts));
    //         },
    //         (errorDetails) => {
    //             this.cLog.debug(`GetFactByID: Failed to load the facts database, error details:`, errorDetails);
    //             deferred.reject({
    //                 msg: "FactsService: GetFactByID: Failed to retrieve the fact.", errorDetails: errorDetails
    //             });
    //         }
    //     );

    //     return deferred.promise;

    // }

    public async GetFactByUniqueID(forID: string): Promise<IFactItem> {

        this.cLog.debug(`FactsService: GetFactByID: loading a fact, [${forID}].`);

        return new Promise<IFactItem>(async (resolve, reject) => {
            try {
                await this._loadAllFactsPromise;
                resolve(Functionals.getEntityByUniqueID(forID, this._allFacts));
            }
            catch (getException) {
                this.cLog.debug(`GetFactByID: Failed to load the facts database, error details:`, getException);
                reject({
                    msg: "FactsService: GetFactByID: Failed to retrieve the fact.",
                    errorDetails: getException
                });

            }
        });

    }

    // public SaveFactng1(theFact: jtfj.Entities.IFactItem): ng.IPromise<boolean> {

    //     this.cLog.debug(`FactsService: SaveFact: Entering. before saving, all facts and fact to save:`, {
    //         presave: this._allFacts, factToSave: theFact
    //     });

    //     const deferred = this.$q.defer<boolean>();

    //     if (!F.IsIDAssigned(theFact)) {
    //         this._recordsService.GetUniqueID().then(
    //             (newID) => {
    //                 theFact.UniqueID = newID;
    //                 this._allFacts = F.getMergedCollection(this._allFacts, theFact);
    //                 this._persistFacts();
    //                 deferred.resolve(true);
    //             }
    //         );
    //     }
    //     else {
    //         this._allFacts = F.getMergedCollection(this._allFacts, theFact);
    //         this._persistFacts();
    //         deferred.resolve(true);
    //     }

    //     return deferred.promise;

    // }

    public async SaveFact(theFact: IFactItem): Promise<boolean> {

        this.cLog.debug(`FactsService: SaveFact: Entering. before saving, all facts and fact to save:`, {
            presave: this._allFacts, factToSave: theFact
        });

        return new Promise<boolean>(async (resolve, reject) => {
            if (!Functionals.isIDAssigned(theFact)) {

                const newID = await this.recordsService.getUniqueID();

                theFact.UniqueID = newID;
                this._allFacts = Functionals.getMergedCollection(this._allFacts, theFact);
                this.persistFacts();
                resolve(true);
            }
            else {
                this._allFacts = Functionals.getMergedCollection(this._allFacts, theFact);
                this.persistFacts();
                resolve(true);
            }

        })

    }

    private async persistFacts(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            try {
                localStorage.setItem(this._localStorageKey, JSON.stringify(this._allFacts));
                resolve(true);
            }
            catch (persistException) {
                reject(persistException);
            }
        });

    }

    private async loadAllFacts(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            try {
                const rawData = localStorage.getItem(this._localStorageKey);

                if (rawData) {
                    this._allFacts = JSON.parse(rawData);
                    this._allFacts = this._allFacts.map((aFact) => {
                        return FactItem.cleanNulls(aFact);
                    });
                }
                else {
                    this._allFacts = [];
                }

                this.cLog.debug(`FactsService: _loadAllFacts: resolving with true.`);
                resolve(true);

            }
        })
    }

    public Create20RandomFacts() {



    }

}
