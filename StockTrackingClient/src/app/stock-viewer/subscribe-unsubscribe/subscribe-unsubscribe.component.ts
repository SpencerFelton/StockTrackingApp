import {Component} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'pm-stockview',
    templateUrl: './subscribe-unsubscribe.component.html',
    styleUrls: ['./subscribe-unsubscribe.component.css'],
})

export class SubscribeUnsubscribeComponent{

    constructor(public dialogRef: MatDialogRef<SubscribeUnsubscribeComponent>) { }


}