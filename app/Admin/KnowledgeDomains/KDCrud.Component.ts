import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { KnowledgeDomainItem } from './KDItem';
import { KnowledgeDomainsService } from './KD.Service';

@Component({
    templateUrl: 'app/Admin/KnowledgeDomains/KDCrud.View.html',
    selector: 'jtfj-kd-crud'
})
export class KnowledgeDomainsCrudComponent implements OnInit, OnDestroy {

    private allKnowledgeDomains: KnowledgeDomainItem[];
    public get AllKnowledgeDomain(): KnowledgeDomainItem[] {
        return this.allKnowledgeDomains;
    }

    private providedKnowledgeDomainID: string;
    private paramSubscription: Subscription;

    private isNewKnowledgeDomainItem: boolean = false;
    public get IsNewItem(): boolean { return this.isNewKnowledgeDomainItem; }

    public InputTitle: string;
    public InputDescription: string;

    constructor(private route: ActivatedRoute,
        private knowledgeDomainService: KnowledgeDomainsService) {

        console.debug(`KnowledgeDomainsCrudComponent: ctor: Entering.`);

    } // constructor

    public ngOnInit() {

        console.debug(`KDCrud.Component: ngOnInit: Entering.`);

        try {

            this.paramSubscription = this.route.params.subscribe(params => {

                console.debug(`KDCrud.Component: ngOnInit: got some params, domainID: [${params["domainID"]}].`);

                this.providedKnowledgeDomainID = params["domainID"];

                this.isNewKnowledgeDomainItem = this.providedKnowledgeDomainID.toLowerCase() === "new" ? true : false;

                if (!this.isNewKnowledgeDomainItem) {

                    console.debug(`KnowledgeDomainsCrudComponent: will need to load up an existing item to edit it.`);
                    
                    this.knowledgeDomainService.getKnowledgeDomainItemByID(this.providedKnowledgeDomainID).then(
                        (existingKnowledgeDomain) => {
                            console.debug(`KDCrud.Component: ngOnInit: Got an existing knowledge domain:`, existingKnowledgeDomain);
                            this.InputDescription = existingKnowledgeDomain.Description;
                            this.InputTitle = existingKnowledgeDomain.Title;
                        });
                }
            });
        }
        catch (initializationException) {
            console.error(`KDCrud.Component: Error: Failed to initialize due to exception:`, initializationException);
        }

    }

    public ngOnDestroy() {
        this.paramSubscription.unsubscribe();
    }

    public Ping(): void {
        this.knowledgeDomainService.ping();
    }

    private returnToKnowledgeDomainsList() {
        //this.$location.path("/Admin/KnowledgeDomains");
    }

    public handleSave() {

        const knowledgeDomainToSave = new KnowledgeDomainItem();
        const confirmationMsg: string = this.isNewKnowledgeDomainItem ? "Saved a new Knowledge Domain!" : "Updated an existing Knowledge Domain!";

        knowledgeDomainToSave.Title = this.InputTitle;
        knowledgeDomainToSave.Description = this.InputDescription;

        if (!this.isNewKnowledgeDomainItem) {
            knowledgeDomainToSave.UniqueID = this.providedKnowledgeDomainID;
        }

        console.debug(`KDCrud.Component: handleSave: Saving a knowledge domain:`, [].concat(knowledgeDomainToSave)[0]);
        this.knowledgeDomainService.saveKnowledgeDomain(knowledgeDomainToSave);

        // const OKModal = this._modalService.CreateOKModal("Saved Knowledge Domain", confirmationMsg).result.then(
        //     (result) => {
        //         this._returnToKnowledgeDomainsList();
        //     }
        // );

    }

    public handleDelete() {

        // const confirmModal = this._modalService.CreateConfirmModal("Confirm Delete", "Are you sure you want to delete this item?");

        // confirmModal.result.then(
        //     (result) => {
        //         if (result) {
        //             this._knowledgeDomainService.DeleteKnowledgeDomainByID(this.$routeParams.knowledgeDomainID);
        //             this._returnToKnowledgeDomainsList();
        //         }
        //     }
        // );
    }

    public handleCancel(isFormDirty: boolean) {

        // if (isFormDirty) {
        //     const confirmModal = this._modalService.CreateConfirmModal("Unsaved Changes", "Warning: You have unsaved changes. Are you sure you want to cancel?");

        //     confirmModal.result.then(
        //         (result) => {
        //             if (result) {
        //                 this._returnToKnowledgeDomainsList();
        //             }
        //         }
        //     );
        // }
        // else {
        //     this._returnToKnowledgeDomainsList();
        // }
    }

}

