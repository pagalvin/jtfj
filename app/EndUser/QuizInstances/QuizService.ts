module jtfj.EndUsers.Services {

    "use strict";

    import F = jtfj.Framework.Functionals;

    export class QuizService extends jtfj.Framework.Services.AbstractAngularService {

        private _localStorageKey: string = "Quiz";

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
            
        }

        public Ping() {
            this.$log.debug(`Quizervice: got a ping, pinging your right back.`);
        }


        public DeleteQuizByUniqueID(forID: string): ng.IPromise<boolean> {

            const deferred = this.$q.defer<boolean>();

            this._persistQuiz();

            return deferred.promise;

        }

        public GetQuizByUniqueID(forID: string): ng.IPromise<jtfj.Entities.IQuizInstanceItem> {

            return this.$q.when(null);
            //const deferred = this.$q.defer<jtfj.Entities.IQuizInstanceItem>();

            //this.$log.debug(`Quizervice: GetQuizByID: loading a Quiz, [${forID}].`);

            //this._loadAllQuizPromise.then(
            //    () => {
            //        this.$log.debug(`Quizervice: GetQuizByID: all Quiz:`, this._allQuiz);
            //        deferred.resolve(<jtfj.Entities.IQuizInstanceItem>jtfj.Framework.Functionals.getEntityByUniqueID(forID, this._allQuiz));
            //    },
            //    (errorDetails) => {
            //        this.$log.debug(`GetQuizByID: Failed to load the Quiz database, error details:`, errorDetails);
            //        deferred.reject({
            //            msg: "Quizervice: GetQuizByID: Failed to retrieve the Quiz.", errorDetails: errorDetails
            //        });
            //    }
            //);

            //return deferred.promise;

        }

        public SaveQuiz(theQuiz: jtfj.Entities.IQuizInstanceItem): ng.IPromise<boolean> {

            return this.$q.when(null);

            //this.$log.debug(`Quizervice: SaveQuiz: Entering. before saving, all Quiz and Quiz to save:`, {
            //    presave: this._allQuiz, QuizToSave: theQuiz
            //});

            //const deferred = this.$q.defer<boolean>();

            //if (!F.IsIDAssigned(theQuiz)) {
            //    this._recordsService.GetUniqueID().then(
            //        (newID) => {
            //            theQuiz.UniqueID = newID;
            //            this._allQuiz = F.mergeEntityIntoCollection(this._allQuiz, theQuiz);
            //            this._persistQuiz();
            //            deferred.resolve(true);
            //        }
            //    );
            //}
            //else {
            //    this._allQuiz = F.mergeEntityIntoCollection(this._allQuiz, theQuiz);
            //    this._persistQuiz();
            //    deferred.resolve(true);
            //}

            //return deferred.promise;

        }

        private _persistQuiz(): void {
            //localStorage.setItem(this._localStorageKey, JSON.stringify(this._allQuiz));
        }

        private _loadAllQuiz(): ng.IPromise<boolean> {

            return this.$q.when(null);

            //this.$log.debug(`Quizervice: Entering, retrieving all quiz templates from local storage.`);

            //const deferred = this.$q.defer<boolean>();

            //const rawData = localStorage.getItem(this._localStorageKey);

            //this.$log.debug(`Quizervice: Entering, raw data:`, rawData);

            //if (rawData) {
            //    this._allQuiz = JSON.parse(rawData);
            //    this._allQuiz = this._allQuiz.map((aQuiz) => {
            //        return Entities.QuizInstanceItem.MakeSafe(aQuiz);
            //    });
            //}
            //else {
            //    this._allQuiz = [];
            //}

            //deferred.resolve(true);

            //return deferred.promise;

        }


    }

    angular
        .module('jtfj')
        .service("jtfj.Admin.Services.Quizervice", QuizService);
}