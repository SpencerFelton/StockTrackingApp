import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';



import {CompanyData} from './shared/company-data';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
//import {subscription} from 
//import {CompanyDataClient} from './shared/company-data-client-DEPRICATED';

import { AppComponent } from './app.component';
import {StockMaker} from './stock-maker/stock-maker.component';
import {PercentChangeComponent} from './shared/percent-change/percent-change.component';
import {StockModify} from './stock-maker/stock-modify.component';
import {WelcomeComponent} from './home/welcome.component';
import {StockViewer} from './stock-viewer/stock-viewer.component';
import {subscriptionView} from './subscriptionView/subscriptionView.component';
import {LoginComponent} from './Login/Login.component';
import {TestCallsComponent} from './shared/TestShit/test-calls.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    StockMaker,
    PercentChangeComponent,
    StockModify,
    WelcomeComponent,
    StockViewer,
    subscriptionView,
    TestCallsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(CompanyData),
    RouterModule.forRoot([
      { path: 'stockmaker', component: StockMaker},
      { path: 'stockviewer', component: StockViewer},
      { path: 'stockmaker/editstock/:id', component: StockModify},
      { path: 'welcome', component:WelcomeComponent},
      { path: 'viewstock', component:StockViewer}, 
      { path: 'login', component:LoginComponent},
      { path: 'subscriptions', component:subscriptionView},
      {path: 'testing', component:TestCallsComponent},
      { path: '',redirectTo: 'welcome', pathMatch: 'full'},
      { path: '**', redirectTo: 'welcome', pathMatch: 'full'}    
    ]),
    MatDialogModule,
    MatCheckboxModule,    
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
