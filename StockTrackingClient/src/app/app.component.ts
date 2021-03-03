
import { Component } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';
//import {LoginComponent} from './Login/Login.component';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Not Stonk';

  constructor(public dialog:MatDialog){}

  /*
  dialogRef:MatDialogRef<LoginComponent, any>;

  openLogin():void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose=true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    this.dialogRef = this.dialog.open(LoginComponent,dialogConfig);

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed')
    });
  }
  */
}
