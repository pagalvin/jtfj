import {AbstractItem} from "../../Framework/AbstractItem";

    export class KnowledgeDomainItem extends AbstractItem {

        public Title: string;
        public Description: string;

        constructor() {
            super();
        }

        static RandomItem(): KnowledgeDomainItem {
            const result = new KnowledgeDomainItem();

            result.Title = "random";// chance.sentence();
            result.Description = "random" //chance.paragraph();

            return result;
        }
    }

