import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSelectModule} from '@angular/material/select';




import {CompanyData} from './shared/company-data';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import {SortDirective} from './directive/sort.directive'
//import {subscription} from 
//import {CompanyDataClient} from './shared/company-data-client-DEPRICATED';
//import { AppTableComponent } from './app-table/app-table.component';
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
<<<<<<< HEAD
import { ChartsModule } from 'ng2-charts';
=======
>>>>>>> 23c466ff0ae8a6a256f17c92d4410725a77d56fb
import {RegisterComponent} from './Register/Register.component';
import { MatNativeDateModule } from '@angular/material/core';
@NgModule({
  declarations: [
    AppComponent,
    StockMaker,
    PercentChangeComponent,
    StockModify,
    WelcomeComponent,
    StockViewer,
    subscriptionView,
    TestCallsComponent,
<<<<<<< HEAD
    SortDirective,
=======
>>>>>>> 23c466ff0ae8a6a256f17c92d4410725a77d56fb
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
<<<<<<< HEAD
    ChartsModule,
=======
>>>>>>> 23c466ff0ae8a6a256f17c92d4410725a77d56fb
    ReactiveFormsModule,
    HttpClientModule,
    InMemoryWebApiModule.forRoot(CompanyData),
    RouterModule.forRoot([
      { path: 'stockmaker', component: StockMaker},
      { path: 'stockviewer', component: StockViewer},
      { path: 'stockmaker/editstock/:id', component: StockModify},
      { path: 'welcome', component:WelcomeComponent},
      { path: 'viewstock', component:StockViewer}, 
      { path: 'login', component:LoginComponent},
      { path: 'register', component:RegisterComponent},
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
    BrowserAnimationsModule,
    MatStepperModule,
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


