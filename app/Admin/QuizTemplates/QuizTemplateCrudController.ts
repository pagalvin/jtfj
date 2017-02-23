module jtfj.Admin.controllers {

    import interfaces = jtfj.Interfaces;
    import entities = jtfj.Entities;
    import F = jtfj.Framework.Functionals;

    interface kdRouteParameters {
        quizTemplateID: string;
    }

    export class QuizTemplateCrudController {

        private _allQuizTemplate: entities.KnowledgeDomainItem[];
        private _isNewQuizTemplateItem: boolean = false;
        public get IsNewItem(): boolean { return this._isNewQuizTemplateItem; }

        public InputQuizTemplateTitle: string;
        public InputDescription: string;
        public InputKnowledgeDomains: entities.KnowledgeDomainItem[];

        public get AllKnowledgeDomains() { return this._kdService.AllKnowledgeDomains; };
        public AllFacts: entities.IFactItem[];
        public AllSelectedFacts: entities.IFactItem[];
        public AllUnselectedFacts: entities.IFactItem[];
        public AllViewFacts: entities.IFactItem[];

        public ActiveFilters: { AllFacts: boolean; OnlySelectedFacts: boolean; OnlyUnselectedFacts: boolean; SearchFilter: string; };

        static $inject = [
            "$q",
            "$log",
            "$routeParams",
            "$location",
            "jtfj.Framework.Services.ModalsFactoryService",
            "jtfj.Admin.Services.QuizTemplatesService",
            "jtfj.Services.KnowledgeDomainsService",
            "jtfj.Services.FactsService"
        ];

        constructor(private $q: ng.IQService,
            private $log: ng.ILogService,
            private $routeParams: kdRouteParameters,
            private $location: ng.ILocationService,
            private _modalService: jtfj.Framework.Services.ModalsFactoryService,
            private _quizTemplatesService: jtfj.Admin.Services.QuizTemplatesService,
            private _kdService: jtfj.Services.KnowledgeDomainsService,
            private _factsService: jtfj.Services.FactsService
        ) {

            this.$log.debug(`QuizTemplateCrudController: ctor: Entering, $routeParams:`, this.$routeParams);

            this.ActiveFilters = {
                AllFacts: false,
                OnlySelectedFacts: true,
                OnlyUnselectedFacts: false,
                SearchFilter: ""
            }
            this.ActiveFilters.SearchFilter = "";

            //this._initializeFactArrays();
            this._initializeQuizTemplate();

        } // constructor

        public HandleFilterOnlySelectedFacts() {
            this.ActiveFilters.AllFacts = false;
            this.ActiveFilters.OnlySelectedFacts = true;
            this.ActiveFilters.OnlyUnselectedFacts = false;

            this.AllViewFacts = [].concat(this.AllSelectedFacts);
        }

        public HandleFilterOnlyUnselectedFacts() {
            this.ActiveFilters.AllFacts = false;
            this.ActiveFilters.OnlySelectedFacts = false;
            this.ActiveFilters.OnlyUnselectedFacts = true;

            this.AllViewFacts = [].concat(this.AllUnselectedFacts);
        }

        public HandleFilterAllFacts() {
            this.ActiveFilters.AllFacts = true;
            this.ActiveFilters.OnlySelectedFacts = true;
            this.ActiveFilters.OnlyUnselectedFacts = true;
            this.AllViewFacts = [].concat(this.AllFacts);

        }

        private _initializeQuizTemplate() {

            this._isNewQuizTemplateItem = this.$routeParams.quizTemplateID.toLowerCase() === "new" ? true : false;

            // set up data load promises
            const loadAllFactsPromise = this._factsService.LoadAllFacts();
            const loadAllKnowledgeDomains = this._kdService.GetKnowledgeDomains();

            const initializeTemplatePromise = this._isNewQuizTemplateItem ? this._initializeNewQuizTemplate() : this._initializeExistingQuizTemplate();

            this.$log.debug(`QuizTemplatecontroller: _initializeQuizTemplate: Waiting on all promises.`);

            this.$q.all([loadAllFactsPromise, loadAllKnowledgeDomains, initializeTemplatePromise]).then(
                () => {

                    this.$log.debug(`QuizTemplatecontroller: _initializeQuizTemplate: Promises all resolved!`);

                    this.AllFacts = this._factsService.AllFacts;
                    this.$log.debug(`QuizTemplateCrudController: _initializeQuizTemplate: all facts:`, this.AllFacts);

                    this.AllUnselectedFacts = this.AllFacts.reduce((allUnselectedFacts, currentAllFact) => {

                        if (F.entityIsInCollection(this.AllSelectedFacts, currentAllFact.UniqueID)) {
                            return allUnselectedFacts;
                        }

                        return allUnselectedFacts.concat(currentAllFact);

                    }, []);

                },
                (errorDetails) => {
                    this.$log.error(`QuizTemplateCrudController: Error: failed to initialize this quiz template! Error details:`, errorDetails);
                }
            );

        }

        private _initializeExistingQuizTemplate(): ng.IPromise<boolean>{

            const deferred = this.$q.defer<boolean>();

            this._quizTemplatesService.GetQuizTemplateByUniqueID(this.$routeParams.quizTemplateID).then(
                (theQuizTemplate) => {

                    this.InputQuizTemplateTitle = theQuizTemplate.Title;
                    this.InputDescription = theQuizTemplate.Description;
                    this.InputKnowledgeDomains = theQuizTemplate.KnowledgeDomains;
                    this.AllSelectedFacts = [].concat(theQuizTemplate.Facts);
                    this.AllViewFacts = [].concat(theQuizTemplate.Facts);

                    this.$log.debug(`QuizTemplateCrudController: _initializeExistingQuizTemplate: got a quiz template just fine, resolving with true, template details:`, theQuizTemplate);
                    deferred.resolve(true);
                },
                (errorDetails) => {

                    this.$log.debug(`QuizTemplateCrudController: _intializeExistingQuizTemplate: Failed to load the QuizTemplate, error details:`, errorDetails);

                    deferred.reject({ msg: `QuizTemplateCrudController: Error, failed to retrieve the quiz template, details:`, deails: errorDetails });
                }
            );

            return deferred.promise;
        }

        private _initializeNewQuizTemplate(): ng.IPromise<boolean> {

            this.InputDescription = "";
            this.InputKnowledgeDomains = [];
            this.InputQuizTemplateTitle = "";
            this.AllSelectedFacts = [];

            return this.$q.when(true);

        }

        public HandleRemoveFactFromTemplate(theFact: entities.IFactItem) {
            //theFact._isDeleted = true;
        }

        private HandleAddFactToQuizTemplate(factToAdd: entities.IFactItem) {

            this.AllSelectedFacts = this.AllSelectedFacts.concat(factToAdd);
            this.AllUnselectedFacts = F.filterOutEntityByUniqueID(factToAdd.UniqueID, this.AllUnselectedFacts);

        }

        public IsFactSelected(factToCheck: entities.IFactItem): boolean {
            return this.AllSelectedFacts.some((aSelectedFact) => { return aSelectedFact.UniqueID === factToCheck.UniqueID; });
        }

        public Ping(): void {
            this._quizTemplatesService.Ping();
        }

        private _returnToQuizTemplateList() {
            this.$location.path("/Admin/QuizTemplates");
        }

        public HandleSave() {

            const QuizTemplateToSave: jtfj.Entities.QuizTemplateItem = new jtfj.Entities.QuizTemplateItem();
            const confirmationMsg: string = this._isNewQuizTemplateItem ? "Saved a new QuizTemplate!" : "Updated an existing QuizTemplate!";

            QuizTemplateToSave.Title = this.InputQuizTemplateTitle;
            QuizTemplateToSave.Description = this.InputDescription;
            QuizTemplateToSave.KnowledgeDomains = this.AllKnowledgeDomains;
            QuizTemplateToSave.Facts = [].concat(this.AllSelectedFacts);
            //QuizTemplateToSave.Facts = this.AllFacts.filter((anItem) => { return true; /*!anItem._isDeleted; */});

            if (!this._isNewQuizTemplateItem) {
                QuizTemplateToSave.UniqueID = this.$routeParams.quizTemplateID;
            }

            this._quizTemplatesService.SaveQuizTemplate(QuizTemplateToSave);

            const OKModal = this._modalService.CreateOKModal("Saved QuizTemplate", confirmationMsg).result.then(
                (result) => {
                    this._returnToQuizTemplateList();
                }
            );

        }

        public HandleDelete() {

            const confirmModal = this._modalService.CreateConfirmModal("Confirm Delete", "Are you sure you want to delete this item?");

            confirmModal.result.then(
                (result) => {
                    if (result) {
                        this._quizTemplatesService.DeleteQuizTemplateByUniqueID(this.$routeParams.quizTemplateID);
                        this._returnToQuizTemplateList();
                    }
                }
            );
        }

        public HandleCancel(isFormDirty: boolean) {

            if (isFormDirty) {
                const confirmModal = this._modalService.CreateConfirmModal("Unsaved Changes", "Warning: You have unsaved changes. Are you sure you want to cancel?");

                confirmModal.result.then(
                    (result) => {
                        if (result) {
                            this._returnToQuizTemplateList();
                        }
                    }
                );
            }
            else {
                this._returnToQuizTemplateList();
            }
        }

        public HandleSelectFact(theFact: entities.IFactItem) {
            this.AllSelectedFacts = this.AllSelectedFacts.concat(theFact);

            this.AllUnselectedFacts = F.filterOutEntityByUniqueID(theFact.UniqueID, this.AllSelectedFacts);
        }

        public HandleDeselectFact(theFact: entities.IFactItem) {
            this.AllUnselectedFacts = this.AllUnselectedFacts.concat(theFact);

            this.AllSelectedFacts = F.filterOutEntityByUniqueID(theFact.UniqueID, this.AllSelectedFacts);
        }

    }

    angular
        .module('jtfj')
        .controller("jtfj.Admin.controllers.QuizTemplateCrudController", QuizTemplateCrudController);
}
