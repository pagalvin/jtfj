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
        private _recordsService: RecordIDsService) {

        super();

        this._loadAllFactsPromise = this._loadAllFacts();

    }

    public Ping() {
        this.cLog.debug(`FactsService: got a ping, pinging your right back.`);
        this._loadAllFacts();
    }


    public LoadAllFacts() {
        return this._loadAllFactsPromise;
    }

    public async DeleteFactByUniqueID(forID: string): Promise<boolean> {

        this._allFacts = this._allFacts.filter((anItem) => {
            return anItem.UniqueID !== forID;
        });

        this._persistFacts();

    }

    public GetFactByUniqueID(forID: string): Promise<IFactItem> {

        this.cLog.debug(`FactsService: GetFactByID: loading a fact, [${forID}].`);

        this._loadAllFactsPromise.then(
            () => {
                this.cLog.debug(`FactsService: GetFactByID: all facts:`, this._allFacts);
                deferred.resolve(<jtfj.Entities.IFactItem>jtfj.Framework.Functionals.getEntityByUniqueID(forID, this._allFacts));
            },
            (errorDetails) => {
                this.cLog.debug(`GetFactByID: Failed to load the facts database, error details:`, errorDetails);
                deferred.reject({
                    msg: "FactsService: GetFactByID: Failed to retrieve the fact.", errorDetails: errorDetails
                });
            }
        );

        return deferred.promise;

    }

    public SaveFact(theFact: jtfj.Entities.IFactItem): ng.IPromise<boolean> {

        this.cLog.debug(`FactsService: SaveFact: Entering. before saving, all facts and fact to save:`, {
            presave: this._allFacts, factToSave: theFact
        });

        const deferred = this.$q.defer<boolean>();

        if (!F.IsIDAssigned(theFact)) {
            this._recordsService.GetUniqueID().then(
                (newID) => {
                    theFact.UniqueID = newID;
                    this._allFacts = F.getMergedCollection(this._allFacts, theFact);
                    this._persistFacts();
                    deferred.resolve(true);
                }
            );
        }
        else {
            this._allFacts = F.getMergedCollection(this._allFacts, theFact);
            this._persistFacts();
            deferred.resolve(true);
        }

        return deferred.promise;

    }

    private async _persistFacts(): Promise<boolean> {

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

    private _loadAllFacts(): ng.IPromise<boolean> {

        const deferred = this.$q.defer<boolean>();

        const rawData = localStorage.getItem(this._localStorageKey);

        if (rawData) {
            this._allFacts = JSON.parse(rawData);
            this._allFacts = this._allFacts.map((aFact) => {
                return Entities.FactItem.MakeSafe(aFact);
            });
        }
        else {
            this._allFacts = [];
        }

        this.cLog.debug(`FactsService: _loadAllFacts: resolving with true.`);

        deferred.resolve(true);
        //this.$q.when(true);

        //http://localhost/jtfj/app/data/sampledata/sampledata.json
        //this.$http.get("/jtfj/app/Data/SampleData/SampleData.json").then(
        //    (results: jtfj.Interfaces.IFact[]) => {
        //        this.$log.debug(`FactsService: _loadAllFacts: got some facts:`, results);
        //        deferred.resolve(results);
        //    },
        //    (errorDetails) => {
        //        this.$log.error(`FactsService: _loadAllFacts: got an error retrieving facts:`, errorDetails);
        //        deferred.reject(errorDetails);
        //    }
        //);

        return deferred.promise;

    }

    public Create20RandomFacts() {



    }

}

angular
    .module('jtfj')
    .service("jtfj.Services.FactsService", FactsService);
