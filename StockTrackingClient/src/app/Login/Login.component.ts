import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {LoginDetails} from './LoginDetails';
import {InputType} from './InputEnum';

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
  
  
  constructor(private formbuilder:FormBuilder){}

  ngOnInit(): void {
    this.LoginForm = this.formbuilder.group({
      accountType: ['', validSelector],
      username: ['',[Validators.required, Validators.minLength(3)]],
      password: ['',[Validators.required, Validators.minLength(3)]],
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
        if((c.touched || c.dirty) && c.errors){
          this.usernameMessage = Object.keys(c.errors).map(
          key => this.validationMessagesUsername[key]).join(' ');
        }
      break;
      case InputType.Password:
        this.passwordMessage= '';
        if((c.touched || c.dirty) && c.errors){
          this.passwordMessage = Object.keys(c.errors).map(
          key => this.validationMessagesPassword[key]).join(' ');
        }
      break;  
    }
  }

  

  save():void{

  }

}
