import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {LoginDetails} from './LoginDetails';
import {InputType} from './InputEnum';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { RegisterComponent } from '../Register/Register.component';

function validSelector(c: AbstractControl):{[ key: string] : boolean} | null {
  if(c.value !== null && c.value == 0){
    return {'required': true};
  }
  return null;
}


@Component({
  selector: "pm-login",  
  templateUrl: './Login.component.html',
  styleUrls: ["./Login.component.css"]


})

export class LoginComponent implements OnInit{  
  LoginForm: FormGroup;
  //user: LoginDetails;
  public pageTitle = 'Please Log In';
  accountTypeMessage:string;
  usernameMessage: string;
  passwordMessage: string;

  accountType:any = ["Client", "Producer"];

  private validationMessagesUsername = {
    required: "Please enter your username.",
    minlength: "The username has to be greater than 3."
  }
  private validationMessagesPassword = {
    required: "Please enter your password.",
    minlength: "The password has to be greater than 3."
  }

  private validationMessageAccountType = {
    required: "Please select a valid account type."
  }
  
  
  constructor(private formbuilder:FormBuilder, private dialog:MatDialog, private dialogRef:MatDialogRef<LoginComponent>){}

  ngOnInit(): void {
    this.LoginForm = this.formbuilder.group({
      accountType: ['', validSelector],
      username: ['',{validators: [Validators.required, Validators.minLength(3)],updateOn: 'blur'}],
      password: ['',{validators: [Validators.required, Validators.minLength(3)],updateOn: 'blur'}],
      keepSignIn: true
    });

    this.LoginForm.get('accountType').setValue(0, {onlySelf: true})

    const selectorControl = this.LoginForm.get("accountType");
    selectorControl.valueChanges.subscribe(
      value =>{
        console.log(String(value));
        this.setMessage(InputType.AccountType, selectorControl)
      }
    )

    const usernameControl = this.LoginForm.get('username');
    usernameControl.valueChanges.subscribe(
      value => {console.log(String("connected to username"));
                this.setMessage(InputType.Username, usernameControl)}
    )
    const passwordControl = this.LoginForm.get('password');
    passwordControl.valueChanges.subscribe(
      value => {console.log(String("connected to password"));
                this.setMessage(InputType.Password, passwordControl)}
    )
  }

  setMessage(input:InputType, c:AbstractControl): void{
    console.log("Input = "+ input);
    switch(+input){
      case InputType.AccountType:
        console.log("I am here!");
        this.accountTypeMessage= '';
        console.log(`if Touched is ${c.touched}`);
        console.log(`if dirty is ${c.dirty}`);
        console.log(`if errors present is ${c.errors}`);
        if((c.touched || c.dirty) && c.errors){
          this.accountTypeMessage = Object.keys(c.errors).map(
          key => this.validationMessageAccountType[key]).join(' ');
        }
      break;
      case InputType.Username:
        this.usernameMessage= '';
        console.log(`if Touched is ${c.touched}`);
        console.log(`if dirty is ${c.dirty}`);
        console.log(`if errors present is ${c.errors}`);
        if((c.touched && c.dirty) && c.errors){
          this.usernameMessage = Object.keys(c.errors).map(
          key => this.validationMessagesUsername[key]).join(' ');
        }
      break;
      case InputType.Password:
        console.log(`Touched: ${c.touched}, Dirty: ${c.dirty}, Pristine: ${c.valid}`);
        this.passwordMessage= '';
        if(c.errors){
          this.passwordMessage = Object.keys(c.errors).map(
          key => this.validationMessagesPassword[key]).join(' ');
        }
      break;  
    }
  }

  openRegistration():void{
    const dialogRef = this.dialog.open(RegisterComponent,{
      width: '800px',
      height: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed')
    });
  }

  closeLogin():void{
    this.dialogRef.close();
  }

  save():void{

  }

}
