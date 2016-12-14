import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { KnowledgeDomainsListComponent} from './Admin/KnowledgeDomains/KnowledgeDomain.Component';
import { KnowledgeDomainsService } from './Admin/KnowledgeDomains/KnowledgeDomains.Service';
import { RecordIDsService } from "./DataServices/RecordIDsService";
import { UserService} from './Framework/Users/UserService';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, KnowledgeDomainsListComponent ],
  providers: [ 
    KnowledgeDomainsService, 
    RecordIDsService, 
    UserService ],
  bootstrap:    [ KnowledgeDomainsListComponent ]
})
export class AppModule { }
