module jtfj.Entities {

    import framework = jtfj.Framework;
    export interface IQuizInstanceItem extends jtfj.Framework.Entities.IAbstractItem {
        Title: string;
        Description: string;
        KnowledgeDomains: jtfj.Entities.KnowledgeDomainItem[];
        Facts: IFactItem[];
    }

    export class QuizInstanceItem extends framework.Entities.AbstractItem implements IQuizInstanceItem{

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

        static MakeSafe(QuizInstanceItem: QuizInstanceItem): QuizInstanceItem {

            const result = new jtfj.Entities.QuizInstanceItem();
            result.Description = QuizInstanceItem.Description || "";
            result.Title = QuizInstanceItem.Title || "";
            result.UniqueID = QuizInstanceItem.UniqueID || "";
            result.Facts = QuizInstanceItem.Facts || [];
            result.KnowledgeDomains = QuizInstanceItem.KnowledgeDomains || [];

            return result;

        }

    }

}