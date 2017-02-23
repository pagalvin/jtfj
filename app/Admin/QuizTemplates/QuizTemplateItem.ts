module jtfj.Entities {

    export interface IQuizTemplateItem extends jtfj.Framework.Entities.IAbstractItem {
        Title: string;
        Description: string;
        KnowledgeDomains: jtfj.Entities.KnowledgeDomainItem[];
        Facts: IFactItem[];
    }

    export class QuizTemplateItem extends jtfj.Framework.Entities.AbstractItem implements IQuizTemplateItem{

        public Title: string;
        public Description: string;
        public KnowledgeDomains: KnowledgeDomainItem[];
        public Facts: IFactItem[];

        constructor() {
            super();

            this.Title = "";
            this.UniqueID = "";
            this.Description = "";
            this.KnowledgeDomains = [];
            this.Facts = [];
        }

        static MakeSafe(QuizTemplateItem: QuizTemplateItem): QuizTemplateItem {

            const result = new jtfj.Entities.QuizTemplateItem();
            result.Description = QuizTemplateItem.Description || "";
            result.Title = QuizTemplateItem.Title || "";
            result.UniqueID = QuizTemplateItem.UniqueID || "";
            result.Facts = QuizTemplateItem.Facts || [];
            result.KnowledgeDomains = QuizTemplateItem.KnowledgeDomains || [];

            return result;

        }

    }

}