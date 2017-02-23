module jtfj.admin.controllers {

    import interfaces = jtfj.Interfaces;
    import F = jtfj.Framework.Functionals;

    export class FactsListController {

        static $inject = [
            "$q",
            "$log",
            "jtfj.Services.FactsService"
        ];

        
        public get AllFacts() { return this._factsService.AllFacts; }

        constructor(private $q: ng.IQService,
            private $log: ng.ILogService,
            private _factsService: jtfj.Services.FactsService) {

            this.$log.debug(`FactsListController: ctor: Entering.`);

            this._factsService.LoadAllFacts();

        } // constructor

        public Ping(): void {
            this._factsService.Ping();
        }

        /**
         * Returns a comma delimited list of knowledge domains suitable for rendering on the UI.
         * @param forDomains: array of knowledge domain items.
         */
        public GetFriendlyKDDisplay(forDomains: Entities.KnowledgeDomainItem[]) {

            return F.stringArrayToCdl(F.extractFieldsFromCollection<string[]>(forDomains, "Title"));
        }
    }

    angular
        .module('jtfj')
        .controller("jtfj.controllers.FactsListController", FactsListController);
}
