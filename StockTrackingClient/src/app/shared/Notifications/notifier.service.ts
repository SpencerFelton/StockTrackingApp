import { Inject } from '@angular/core';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotificationsComponent} from './notifications.component';

@Injectable({
    providedIn: 'root'
})

export class NotifierService{

    constructor(private snackBar: MatSnackBar){}

    showNotification(notificationMessage:string, buttonMessage:string,messageType:'error' | 'success', imageType:'tick'|'cross'|'upload'){
        this.snackBar.openFromComponent(NotificationsComponent,{
            data:{
                message:notificationMessage,
                buttonText:buttonMessage,
                image:imageType

        },
        duration:2000,
        horizontalPosition:'right',
        verticalPosition:'bottom',
        panelClass: messageType
    });

    }
}