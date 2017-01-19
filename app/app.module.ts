import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { RecordIDsService } from "./DataServices/RecordIDsService";
import { UserService } from './Framework/Users/UserService';
import { GlobalFooterComponent } from './Menus/GlobalFooter/GlobalFooter.Component';

import { KnowledgeDomainsListComponent } from './Admin/KnowledgeDomains/KDList.Component';
import { KnowledgeDomainsCrudComponent } from './Admin/KnowledgeDomains/KDCrud.Component';
import { KnowledgeDomainsService } from './Admin/KnowledgeDomains/KD.Service';


const appRoutes: Routes = [
  //{ path: '', component: GlobalNavComponent},
  { path: 'Admin/KnowledgeDomain/:domainID', component: KnowledgeDomainsCrudComponent},
  { path: 'Admin/KnowledgeDomains', component: KnowledgeDomainsListComponent}
 // { path: '**', component: KnowledgeDomainsListComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    KnowledgeDomainsListComponent,
    KnowledgeDomainsCrudComponent,
    GlobalFooterComponent,
    AppComponent
  ],
  providers: [
    KnowledgeDomainsService,
    RecordIDsService,
    UserService],
  bootstrap: [AppComponent, GlobalFooterComponent]
})

export class AppModule { }
