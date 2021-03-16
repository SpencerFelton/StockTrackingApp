// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@auth0/auth0-angular';

import {WelcomeComponent} from './home/welcome.component';
import {StockViewer} from './client-side/stock-viewer/stock-viewer.component';
import {SubscriptionViewer} from './client-side/subscription-viewer/subscription-viewer.component';
import {StockMaker} from './provider-side/stock-maker.component';
import {AccountViewComponent} from './AccountInformation/account.component';


const routes: Routes = [
    {
        path: 'welcome',
        component: WelcomeComponent,
        pathMatch: 'full',
    },
  {
    path: '',
    component: WelcomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'stockmaker',
    component: StockMaker,
    canActivate: [AuthGuard],
  },
  {
    path: 'viewstock',
    component: StockViewer,
    canActivate: [AuthGuard],
  },
  {
    path: 'subscriptions',
    component: SubscriptionViewer,
    canActivate: [AuthGuard],
  },
  {
    path: 'account',
    component: AccountViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}