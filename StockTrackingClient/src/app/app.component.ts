
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

  constructor(public dialog:MatDialog){
    this.setupRedirects();
  }

  setupRedirects(){
    localStorage.setItem('a9f48d1504bc45c1','/callback');
  }
}
