// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@auth0/auth0-angular';

import {WelcomeComponent} from './pages/unrestricted/home/welcome.component';
import {StockViewer} from './pages/restricted/client/stock-viewer/stock-viewer.component';
import {SubscriptionViewer} from './pages/restricted/client/subscription-viewer/subscription-viewer.component';
import {StockMaker} from './pages/restricted/provider/stock-maker/stock-maker.component';
import {AccountViewComponent} from './pages/restricted/shared/account/account-page/account.component';
import { AboutUsComponent } from './pages/unrestricted/about-us/about-us.component';
import { ChangelogComponent } from './pages/unrestricted/changelog/changelog.component';


const routes: Routes = [
    {
        path: 'welcome',
        component: WelcomeComponent,
        pathMatch: 'full',
    },
    {
      path: 'aboutus',
      component: AboutUsComponent,
      pathMatch: 'full',
  },
  {
    path: 'changelog',
    component: ChangelogComponent,
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