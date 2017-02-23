import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import {ConsoleLog} from './Framework/Logging/ConsoleLogService';

import { RecordIDsService } from "./DataServices/RecordIDsService";
import { UserService } from './Framework/Users/UserService';
import { GlobalFooterComponent } from './Menus/GlobalFooter/GlobalFooter.Component';

import { KnowledgeDomainsListComponent } from './Admin/KnowledgeDomains/KDList.Component';
import { KnowledgeDomainsCrudComponent } from './Admin/KnowledgeDomains/KDCrud.Component';
import { KnowledgeDomainsService } from './Admin/KnowledgeDomains/KD.Service';

import { FactCrudComponent } from './Admin/Facts/FactCrud.Component';
import { FactsListComponent } from './Admin/Facts/FactList.Component';
import { FactsService } from './Admin/Facts/Facts.Service';
import { ErrorsService } from './Framework/ErrorHandling/ErrorsService';

const appRoutes: Routes = [
  { path: 'Admin/KnowledgeDomain/:domainID', component: KnowledgeDomainsCrudComponent},
  { path: 'Admin/KnowledgeDomains', component: KnowledgeDomainsListComponent},
  { path: 'Admin/Facts', component: FactsListComponent},
  { path: 'Admin/Fact/:factID', component: FactCrudComponent}
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    FactsListComponent,
    FactCrudComponent,
    KnowledgeDomainsListComponent,
    KnowledgeDomainsCrudComponent,
    GlobalFooterComponent,
    AppComponent
  ],
  providers: [
    ConsoleLog,
    ErrorsService,
    FactsService,
    KnowledgeDomainsService,
    RecordIDsService,
    UserService],
  bootstrap: [AppComponent, GlobalFooterComponent]
})

export class AppModule { }
