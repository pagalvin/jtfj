import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { KnowledgeDomainItem } from './KDItem';
import { KnowledgeDomainsService } from './KD.Service';

import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';

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

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,
        private knowledgeDomainService: KnowledgeDomainsService,
        private clog: ConsoleLog) {

        clog.debug(`KnowledgeDomainsCrudComponent: ctor: Entering.`);

    } // constructor

    async xyzzy() {
        const result = await this.knowledgeDomainService.getKnowledgeDomainItemByID("paulA");


    }

    public oldngOnInit() {

        this.clog.debug(`KDCrud.Component: ngOnInit: Entering.`);

        try {

            this.paramSubscription = this.activatedRoute.params.subscribe(params => {

                this.clog.debug(`KDCrud.Component: ngOnInit: got some params, domainID: [${params["domainID"]}].`);

                this.providedKnowledgeDomainID = params["domainID"];

                this.isNewKnowledgeDomainItem = this.providedKnowledgeDomainID.toLowerCase() === "new" ? true : false;

                if (!this.isNewKnowledgeDomainItem) {

                    this.clog.debug(`KnowledgeDomainsCrudComponent: will need to load up an existing item to edit it.`);



                    this.knowledgeDomainService.getKnowledgeDomainItemByID(this.providedKnowledgeDomainID).then(
                        (existingKnowledgeDomain) => {
                            this.clog.debug(`KDCrud.Component: ngOnInit: Got an existing knowledge domain:`, existingKnowledgeDomain);
                            this.InputDescription = existingKnowledgeDomain.Description;
                            this.InputTitle = existingKnowledgeDomain.Title;
                        },
                        (errorDetails) => {
                            this.clog.error(`KDCrud.Component: ngOnInit: Error: Was told to retrieve ` +
                                `a knowledge domain but got an error instead:`, errorDetails);
                            this.InputDescription = JSON.stringify(errorDetails);
                            this.InputTitle = "ERROR";
                        }
                    );


                }
            });
        }
        catch (initializationException) {
            this.clog.error(`KDCrud.Component: Error: Failed to initialize due to exception:`, initializationException);
        }

    }

    public ngOnInit() {

        this.clog.debug(`KDCrud.Component: ngOnInit: Entering.`);

        try {
            this.paramSubscription = this.activatedRoute.params.subscribe(params => {
                this.initializeWorkingKnowledgeDomain(params);
            });
        }
        catch (initializationException) {
            this.clog.error(`KDCrud.Component: Error: Failed to initialize due to exception:`, initializationException);
        }

    }

    private async initializeWorkingKnowledgeDomain(params: any) {

        this.clog.debug(`KDCrud.Component: ngOnInit: got some params, domainID: [${params["domainID"]}].`);
        this.providedKnowledgeDomainID = params["domainID"];

        this.isNewKnowledgeDomainItem = this.providedKnowledgeDomainID.toLowerCase() === "new" ? true : false;

        if (!this.isNewKnowledgeDomainItem) {

            this.clog.debug(`KnowledgeDomainsCrudComponent: will need to load up an existing item to edit it.`);

            try {
                const existingKnowledgeDomain = 
                    await this.knowledgeDomainService.getKnowledgeDomainItemByID(this.providedKnowledgeDomainID);
                this.clog.debug(`KDCrud.Component: ngOnInit: Got an existing knowledge domain:`, existingKnowledgeDomain);
                this.InputDescription = existingKnowledgeDomain.Description;
                this.InputTitle = existingKnowledgeDomain.Title;
            }
            catch (errorDetails) {
                this.clog.error(`KDCrud.Component: ngOnInit: Error: Was told to retrieve ` +
                    `a knowledge domain but got an error instead:`, errorDetails);
                this.InputDescription = JSON.stringify(errorDetails);
                this.InputTitle = "ERROR";

            }
        }
    }

    public ngOnDestroy() {
        this.paramSubscription.unsubscribe();
    }

    public Ping(): void {
        this.knowledgeDomainService.ping();
    }

    private returnToKnowledgeDomainsList() {
        this.clog.debug("KDCrud.Component: returnToKnowledgeDomainsList: Entering.");
        //this.router.navigateByUrl("/Admin/KnowledgeDomains");
        this.router.navigate(["/Admin/KnowledgeDomains"]);

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

        this.clog.debug(`KDCrud.Component: handleSave: Saving a knowledge domain (v2):`, [].concat(knowledgeDomainToSave)[0]);
        this.knowledgeDomainService.saveKnowledgeDomain(knowledgeDomainToSave);

        this.clog.debug(`KDCrud.Component: handleSave: changing route.`);

        this.returnToKnowledgeDomainsList();
        // const OKModal = this._modalService.CreateOKModal("Saved Knowledge Domain", confirmationMsg).result.then(
        //     (result) => {
        //         this._returnToKnowledgeDomainsList();
        //     }
        // );

    }

    public handleDelete() {

        this.clog.debug(`KDCrud.Component: handleDelete: Entering.`);

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

