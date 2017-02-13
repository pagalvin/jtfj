module jtfj.Services {

    "use strict";

    import F = jtfj.Framework.Functionals;

    export class FactsService extends jtfj.Framework.Services.AbstractAngularService {

        private _localStorageKey: string = "AllFacts";

        private _allFacts: jtfj.Entities.IFactItem[];
        public get AllFacts(): jtfj.Entities.IFactItem[] { return this._allFacts; }

        private _loadAllFactsPromise: ng.IPromise<boolean>;

        static $inject = [
            "$http",
            "$q",
            "$log",
            "jtfj.Services.RecordIDsService"
        ];

        constructor(
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private $log: ng.ILogService,
            private _recordsService: jtfj.Services.RecordIDsService) {

            super();

            this._loadAllFactsPromise = this._loadAllFacts();

        }

        public Ping() {
            this.$log.debug(`FactsService: got a ping, pinging your right back.`);
            this._loadAllFacts();
        }


        public LoadAllFacts() {
            return this._loadAllFactsPromise;
        }

        public DeleteFactByUniqueID(forID: string): ng.IPromise<boolean> {

            const deferred = this.$q.defer<boolean>();

            this._allFacts = this._allFacts.filter((anItem) => {
                return anItem.UniqueID !== forID;
            });

            this._persistFacts();

            return deferred.promise;

        }

        public GetFactByUniqueID(forID: string): ng.IPromise<jtfj.Entities.IFactItem> {

            const deferred = this.$q.defer<jtfj.Entities.IFactItem>();

            this.$log.debug(`FactsService: GetFactByID: loading a fact, [${forID}].`);

            this._loadAllFactsPromise.then(
                () => {
                    this.$log.debug(`FactsService: GetFactByID: all facts:`, this._allFacts);
                    deferred.resolve(<jtfj.Entities.IFactItem>jtfj.Framework.Functionals.getEntityByUniqueID(forID, this._allFacts));
                },
                (errorDetails) => {
                    this.$log.debug(`GetFactByID: Failed to load the facts database, error details:`, errorDetails);
                    deferred.reject({
                        msg: "FactsService: GetFactByID: Failed to retrieve the fact.", errorDetails: errorDetails
                    });
                }
            );

            return deferred.promise;

        }

        public SaveFact(theFact: jtfj.Entities.IFactItem): ng.IPromise<boolean> {

            this.$log.debug(`FactsService: SaveFact: Entering. before saving, all facts and fact to save:`, {
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

        private _persistFacts(): void {
            localStorage.setItem(this._localStorageKey, JSON.stringify(this._allFacts));
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

            this.$log.debug(`FactsService: _loadAllFacts: resolving with true.`);

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
}