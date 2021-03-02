import { Component,  OnInit } from "@angular/core";
import {AuthService} from '@auth0/auth0-angular';


@Component({
    selector: 'pm-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']

})

export class AccountViewComponent{

    constructor(public auth: AuthService){}


}