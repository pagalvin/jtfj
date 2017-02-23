module jtfj.Admin.controllers {

    import interfaces = jtfj.Interfaces;
    import F = jtfj.Framework.Functionals;

    export class QuizTemplatesController {

        static $inject = [
            "$q",
            "$log",
            "jtfj.Admin.Services.QuizTemplatesService"
        ];

        
        public get AllQuizTemplates() { return this._quizTemplatesService.AllQuizTemplates; }

        constructor(private $q: ng.IQService,
            private $log: ng.ILogService,
            private _quizTemplatesService: jtfj.Admin.Services.QuizTemplatesService) {

            this.$log.debug(`QuizTemplatesController: ctor: Entering.`);

            this._quizTemplatesService.LoadAllQuizTemplates().then(
                (results) => {
                    this.$log.debug(`ListQuizTemplateController: Loaded quiz templates:`, this.AllQuizTemplates);
                },
                (errorDetails) => {
                }
            );

        } // constructor

        public Ping(): void {
            this._quizTemplatesService.Ping();
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
        .controller("jtfj.Admin.controllers.QuizTemplatesController", QuizTemplatesController);
}
