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
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatSliderModule} from '@angular/material/slider';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { NgxColorsModule } from 'ngx-colors';



//import {CompanyData} from './shared/company-data';
//import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import {SortDirective} from './directive/sort.directive'
//import {subscription} from 
//import {CompanyDataClient} from './shared/company-data-client-DEPRICATED';
//import { AppTableComponent } from './app-table/app-table.component';
import { AppComponent } from './app.component';
import {StockMaker} from 'src/app/pages/restricted/provider/stock-maker/stock-maker.component';
import {PercentChangeComponent} from './components/percent-change/percent-change.component';
import {WelcomeComponent} from './pages/unrestricted/home/welcome.component';
import {StockViewer} from './client-side/stock-viewer/stock-viewer.component';
import {SubscriptionViewer} from './client-side/subscription-viewer/subscription-viewer.component';
//import {LoginComponent} from './Login/Login.component';
import {TestCallsComponent} from './shared/TestShit/test-calls.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
//import {RegisterComponent} from './Register/Register.component';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {StockChartComponent} from './components/stock-chart/stock-chart.component';
import {SubscribeUnsubscribeComponent} from './client-side/dialog-boxes/subscribe-unsubscribe/subscribe-unsubscribe.component';
import {AddStockPriceComponent} from './provider-side/add-stock-price/add-stock-price.component';
import {UpdateStockNameComponent} from './provider-side/update-stock-name/update-stock-name.component';
import {DeleteStockComponent} from './provider-side/delete-stock/delete-stock.component';
import {CreateNewStockComponent} from './provider-side/create-new-stock/create-new-stock.component';
//import {RulerGeneratorComponent} from 'src/app/components/stock-chart/ruler-generator.component';
import {DeleteAccountComponent} from 'src/app/AccountInformation/delete-account/delete-account.component';
import {ChangePasswordComponent} from 'src/app/AccountInformation/change-password/change-password.component';

//import {}

// Import the Auth0 module from the SDK
import { AuthModule } from '@auth0/auth0-angular';
import { environment as env } from '../environments/environment';
import {AuthButtonComponent} from './components/Login-Auth0/login-auth0.component';
import {AppRoutingModule} from './app-routing.module';

import {AccountButtonComponent} from './AccountInformation/account-button.component';
import {AccountViewComponent} from './AccountInformation/account.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';

//Account Service (REMOVE FOR API)

@NgModule({
  declarations: [
    AppComponent,
    StockMaker,
    PercentChangeComponent,
    WelcomeComponent,
    StockViewer,
    SubscriptionViewer,
    TestCallsComponent,
    SortDirective,
    //LoginComponent,
    //RegisterComponent,
    AuthButtonComponent,
    AccountButtonComponent,
    AccountViewComponent,
    StockChartComponent,
    SubscribeUnsubscribeComponent,
    AddStockPriceComponent,
    UpdateStockNameComponent,
    DeleteStockComponent,
    CreateNewStockComponent,
    //RulerGeneratorComponent,
    DeleteAccountComponent,
    ChangePasswordComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    HttpClientModule,
    //InMemoryWebApiModule.forRoot(CompanyData),
    RouterModule.forRoot([
      { path: 'stockmaker', component: StockMaker},
      { path: 'stockviewer', component: StockViewer},
      //{ path: 'stockmaker/editstock/:id', component: StockModify},
      { path: 'welcome', component:WelcomeComponent},
      { path: 'viewstock', component:StockViewer}, 
      //{ path: 'login', component:LoginComponent},
      //{ path: 'register', component:RegisterComponent},
      {path: 'account', component: AccountViewComponent},
      { path: 'subscriptions', component:SubscriptionViewer},
      {path: 'testing', component:TestCallsComponent},
      { path: '',redirectTo: 'welcome', pathMatch: 'full'},
      { path: '**', redirectTo: 'welcome', pathMatch: 'full'}    
    ]),
    AuthModule.forRoot({
      ...env.auth,
      httpInterceptor:{
          allowedList: [//`${env.dev.serverUrlProvider}/api/stocks`, 
          `${env.dev.serverUrlClient}/api/*`, 
          /*
          `${env.dev.serverUrlProvider}/api/prices/latestinfo`, 
          `${env.dev.serverUrlClient}/api/prices/latestinfo`, 
          `${env.dev.serverUrlClient}/api/Subscriptions/ViewAll`,
          `${env.dev.serverUrlClient}/api/subscriptions/`,
          */
          `${env.dev.serverUrlProvider}/api/*`,
          `https://${env.auth.domain}/*`
        ],
      }
    }),
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
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSliderModule,
    NgxMatColorPickerModule,
    NgxColorsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


