import {Component, Input, Inject, OnInit} from "@angular/core";

import {NotificationType} from "./notificationtype";
import {MatCardModule} from '@angular/material/card';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';



@Component({
    selector: "pm-notification",
    templateUrl: "./notifications.component.html",
    styleUrls:["./notifications.component.css"]
})

export class NotificationsComponent implements OnInit{
    imageData:string[] = ['',''];

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data:any, public snackBarRef:MatSnackBarRef<NotificationsComponent>){
        if(data.image == 'upload'){
            this.imageData=["bi bi-arrow-bar-up","M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"];
        }else if(data.image == 'tick'){
            this.imageData=["bi bi-check2","M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"];
        }else{
            this.imageData=["bi bi-x","M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"];
        }
    }
    ngOnInit(): void {

    }

    //@Input() type: NotificationType;
    //@Input() message: number;



}