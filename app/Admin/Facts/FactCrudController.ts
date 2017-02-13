module jtfj.admin.controllers {

    import interfaces = jtfj.Interfaces;
    import entities = jtfj.Entities;

    interface kdRouteParameters {
        factID: string;
    }

    export class FactCrudController {

        private _allFact: entities.KnowledgeDomainItem[];
        public get AllKnowledgeDomain(): entities.KnowledgeDomainItem[] {
            return this._allFact;
        }

        
        private _isNewFactItem: boolean = false;
        public get IsNewItem(): boolean { return this._isNewFactItem; }

        public InputFactStatement: string;
        public InputDescription: string;
        public InputKnowledgeDomains: string[];
        public get AllKnowledgeDomains() { return this._kdService.AllKnowledgeDomains; };
        public AllQuestions: entities.IQuestion[];
        public AllWrongAnswers: entities.IWrongAnswer[];
        public AllCorrectAnswers: entities.ICorrectAnswer[];

        static $inject = [
            "$q",
            "$log",
            "$routeParams",
            "$location",
            "jtfj.Framework.Services.ModalsFactoryService",
            "jtfj.Services.FactsService",
            "jtfj.Services.KnowledgeDomainsService"
        ];

        constructor(private $q: ng.IQService,
            private $log: ng.ILogService,
            private $routeParams: kdRouteParameters,
            private $location: ng.ILocationService,
            private _modalService: jtfj.Framework.Services.ModalsFactoryService,
            private _factsService: jtfj.Services.FactsService,
            private _kdService: jtfj.Services.KnowledgeDomainsService
        ) {

            this.$log.debug(`KnowledgeDomainCrudController: ctor: Entering.`);

            this._initializeFact();

        } // constructor

        private _initializeFact() {

            this._isNewFactItem = this.$routeParams.factID.toLowerCase() === "new" ? true : false;

            this._kdService.GetKnowledgeDomains().then(
                () => {

                },
                () => {

                }
            );

            if (this._isNewFactItem) {
                this._initializeNewFact();
            }
            else {
                this._initializeExistingFact();
            }
        }

        private _initializeExistingFact() {

            this._factsService.GetFactByUniqueID(this.$routeParams.factID).then(
                (theFact) => {
                    this.InputFactStatement = theFact.FactStatement;
                    this.InputDescription = theFact.Description;
                    this.InputKnowledgeDomains = theFact.KnowledgeDomains;
                    this.AllQuestions = [].concat(theFact.Questions);
                    this.AllWrongAnswers = [].concat(theFact.WrongAnswers);
                    this.AllCorrectAnswers = [].concat(theFact.CorrectAnswers);
                },
                (errorDetails) => {
                    this.$log.debug(`FactCrudController: _intializeExistingFact: Failed to load the fact, error details:`, errorDetails);
                }
            );

        }

        public HandleDeleteQuestion(theQuestion: entities.IQuestion) {
            theQuestion._isDeleted = true;
        }

        public HandleDeleteWrongAnswer(theWrongAnswer: entities.IWrongAnswer) {
            theWrongAnswer._isDeleted = true;
        }

        public HandleDeleteCorrectAnswer(theCorrectAnswer: entities.ICorrectAnswer) {
            theCorrectAnswer._isDeleted = true;
        }

        private HandleAddNewQuestion() {
            const newQuestion: entities.IQuestion = {
                Question: "",
                _isEditing: true,
                _isDeleted: false
            };

            this.AllQuestions = this.AllQuestions.concat(newQuestion);
        }

        private HandleAddNewCorrectAnswer() {
            const newCorrectAnswer: entities.ICorrectAnswer = {
                CorrectAnswer: "",
                _isEditing: true,
                _isDeleted: false
            };

            this.AllCorrectAnswers = this.AllCorrectAnswers.concat(newCorrectAnswer);
        }

        private HandleAddNewWrongAnswer() {
            const newWrongAnswer: entities.IWrongAnswer = {
                WrongAnswer: "",
                TruthAffinity: 50,
                _isEditing: true,
                _isDeleted: false
            };

            this.AllWrongAnswers = this.AllWrongAnswers.concat(newWrongAnswer);
        }

        private _initializeNewFact() {
            
            this.InputDescription = "";
            this.InputKnowledgeDomains = [];
            this.InputFactStatement = "";
            this.AllWrongAnswers = [];
            this.AllQuestions = [];
            this.AllCorrectAnswers = [];
        }

        public Ping(): void {
            this._factsService.Ping();
        }

        private _returnToFactList() {
            this.$location.path("/Admin/Facts");
        }

        public HandleSave() {

            const factToSave: jtfj.Entities.FactItem = new jtfj.Entities.FactItem();
            const confirmationMsg: string = this._isNewFactItem ? "Saved a new fact!" : "Updated an existing fact!";

            factToSave.FactStatement = this.InputFactStatement;
            factToSave.Description = this.InputDescription;
            factToSave.KnowledgeDomains = this.InputKnowledgeDomains;
            factToSave.Questions = this.AllQuestions.filter((anItem) => { return !anItem._isDeleted; });
            factToSave.WrongAnswers = this.AllWrongAnswers.filter((anItem) => { return !anItem._isDeleted; });
            factToSave.CorrectAnswers = [].concat(this.AllCorrectAnswers);

            if (!this._isNewFactItem) {
                factToSave.UniqueID = this.$routeParams.factID;
            }

            this._factsService.SaveFact(factToSave);

            const OKModal = this._modalService.CreateOKModal("Saved Fact", confirmationMsg).result.then(
                (result) => {
                    this._returnToFactList();
                }
            );

        }

        public HandleDelete() {

            const confirmModal = this._modalService.CreateConfirmModal("Confirm Delete", "Are you sure you want to delete this item?");

            confirmModal.result.then(
                (result) => {
                    if (result) {
                        this._factsService.DeleteFactByUniqueID(this.$routeParams.factID);
                        this._returnToFactList();
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
                            this._returnToFactList();
                        }
                    }
                );
            }
            else {
                this._returnToFactList();
            }
        }

    }

    angular
        .module('jtfj')
        .controller("jtfj.controllers.FactCrudController", FactCrudController);
}
