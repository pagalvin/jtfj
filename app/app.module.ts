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

import { QuizTemplatesListComponent } from './Admin/QuizTemplates/QTList.Component'
import { QuizTemplatesService } from './Admin/QuizTemplates/QT.Service'
import { QTCrudComponent } from './Admin/QuizTemplates/QTCrud.Component';
import { FactCrudComponent } from './Admin/Facts/FactCrud.Component';
import { FactsListComponent } from './Admin/Facts/FactsList.Component';
import { FactsService } from './Admin/Facts/Facts.Service';

import { ErrorsService } from './Framework/ErrorHandling/ErrorsService';

const appRoutes: Routes = [
  { path: 'Admin/KnowledgeDomain/:domainID', component: KnowledgeDomainsCrudComponent},
  { path: 'Admin/KnowledgeDomains', component: KnowledgeDomainsListComponent},
  { path: 'Admin/Facts', component: FactsListComponent},
  { path: 'Admin/Fact/:factID', component: FactCrudComponent},
  { path: 'Admin/QuizTemplates', component: QuizTemplatesListComponent},
  { path: 'Admin/QuizTemplate/:quizTemplateID', component: QTCrudComponent}
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
    QuizTemplatesListComponent,
    QTCrudComponent,
    AppComponent
  ],
  providers: [
    ConsoleLog,
    ErrorsService,
    FactsService,
    KnowledgeDomainsService,
    QuizTemplatesService,
    RecordIDsService,
    UserService],
  bootstrap: [AppComponent, GlobalFooterComponent]
})

export class AppModule { }
