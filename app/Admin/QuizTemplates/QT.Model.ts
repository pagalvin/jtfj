import {AbstractItem} from "../../Framework/AbstractItem";
import {IAbstractItem} from "../../Framework/AbstractItem";
import {KnowledgeDomainItem} from "../KnowledgeDomains/KDItem";

import * as FactModel from "../Facts/FactModel";

    export interface IQuizTemplateItem extends IAbstractItem{
        Title: string;
        Description: string;
        KnowledgeDomains: KnowledgeDomainItem[];
        Facts: FactModel.IFactItem[];
    }

    export class QuizTemplateItem extends AbstractItem implements IQuizTemplateItem{

        public Title: string;
        public Description: string;
        public KnowledgeDomains: KnowledgeDomainItem[];
        public Facts: FactModel.IFactItem[];

        constructor() {
            super();

            this.Title = "";
            this.UniqueID = "";
            this.Description = "";
            this.KnowledgeDomains = [];
            this.Facts = [];
        }

        static MakeSafe(theItem: QuizTemplateItem): QuizTemplateItem {

            const result = new QuizTemplateItem();
            result.Description = theItem.Description || "";
            result.Title = theItem.Title || "";
            result.UniqueID = theItem.UniqueID || "";
            result.Facts = theItem.Facts || [];
            result.KnowledgeDomains = theItem.KnowledgeDomains || [];

            return result;

        }

    }

