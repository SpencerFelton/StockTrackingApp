import { Component, OnInit } from '@angular/core';
import {FormArray, FormGroup, FormControl, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {RegistrationDetails} from './RegistrationDetails';
import {RegisterType} from './RegisterEnum';
import { min } from 'rxjs/operators';


function validSelector(c: AbstractControl):{[ key: string] : boolean} | null {
  if(c.value !== null && c.value == 0){
    return {'required': true};
  }
  return null;
}


@Component({
  selector: "pm-register",  
  templateUrl: './Register.component.html',
  styleUrls: ["./Register.component.css"]


})

export class RegisterComponent implements OnInit{  
  RegisterForm: FormGroup;
  user: RegistrationDetails;
  public pageTitle = 'Please Register';

  emailMessage: string;  
  usernameMessage: string;
  passwordMessage: string;
  firstNameMessage: string;
  lastNameMessage: string;
  dateOfBirthMessage: string;
  accountTypeMessage:string;
  companyNameMessage:string;
  allValidMessage:string;
  TOSMessage: string;
  clientOrProducerMessage:string;

  accountType:any = ["Client", "Producer"];

  private validationMessageEmail = {
      required: "Please enter an email address.",
      email: "Please enter a valid email address."
  }

  private validationMessagesUsername = {
    required: "Please enter your username.",
    minlength: "The username has to be greater than 3."
  }
  private validationMessagesPassword = {
    required: "Please enter your password.",
    minlength: "The password has to be greater than 3."
  }

  private validationMessageFirstName = {
    required: "Please enter your first name."
}

private validationMessageLastName = {
    required: "Please enter your first name."
}

  private validationMessageDOB = {
      required: "Please put in a date of birth.",
      min: "You need to be 18 years or older to make an account."
  }
  
  
  private validationMessageAccountType = {
    required: "Please select a valid account type."
  }

  private validationMessageCompanyName = {
      required: "Please enter a company name."
  }

  private validationMessageAllValid = {
    required: "You must agree that the form has been filled out to the best of your ability before continuing."
}
    private validationMessageTOS = {
    required: "You must agree to the terms of service before continuing."
    }



  constructor(private formbuilder:FormBuilder){}
    get RegistrarDetailsFunc(): FormArray{
      return this.RegisterForm.controls.RegistrarDetails as FormArray;
    }

  ngOnInit(): void {
    this.RegisterForm = this.formbuilder.group({
        RegistrarDetails: this.formbuilder.array([])
    });

    //var getRegistrar = this.RegisterForm.controls.RegistrarDetails as FormArray;

    this.RegistrarDetailsFunc.push(this.formbuilder.group({
        email:['',[Validators.required, Validators.email]],
        username: ['',[Validators.required, Validators.minLength(3)]],
        password: ['',[Validators.required, Validators.minLength(3)]]
    }));

    this.RegistrarDetailsFunc.push(this.formbuilder.group({
        firstName:['',[Validators.required, Validators.minLength(3)]],
        lastName:['',[Validators.required, Validators.minLength(3)]],
        dateOfBirth: ['', [Validators.required,Validators.min(18)]]
    }));

    this.RegistrarDetailsFunc.push(this.formbuilder.group({
        accountType: ['', validSelector],
        companyName: ['',[Validators.required, Validators.minLength(3)]],
    }));

    this.RegistrarDetailsFunc.push(this.formbuilder.group({
        allValid: ['',Validators.required],
        readTerms:  ['',Validators.required]
    }))
        


        //phoneNumber: ['',[Validators.required, Validators.minLength(3)]]
    

    this.RegistrarDetailsFunc.get([2]).get('accountType').setValue(0, {onlySelf: true})

    const emailControl = this.RegistrarDetailsFunc.get([0]).get('email');
    emailControl.valueChanges.subscribe(
      value => {console.log(String("connected to username"));
                this.setMessage(RegisterType.Email, emailControl)}
    )

    const usernameControl = this.RegistrarDetailsFunc.get([0]).get('username');
    usernameControl.valueChanges.subscribe(
      value => {console.log(String("connected to username"));
                this.setMessage(RegisterType.Username, usernameControl)}
    )
    
    const passwordControl = this.RegistrarDetailsFunc.get([0]).get('password');
    passwordControl.valueChanges.subscribe(
      value => {console.log(String("connected to password"));
                this.setMessage(RegisterType.Password, passwordControl)}
    )

    const firstNameControl = this.RegistrarDetailsFunc.get([1]).get('firstName');
    firstNameControl.valueChanges.subscribe(
      value => {console.log(String("connected to password"));
                this.setMessage(RegisterType.FirstName, firstNameControl)}
    )

    const lastNameControl = this.RegistrarDetailsFunc.get([1]).get('lastName');
    lastNameControl.valueChanges.subscribe(
      value => {console.log(String("connected to password"));
                this.setMessage(RegisterType.LastName, lastNameControl)}
    )

    const DOBControl = this.RegistrarDetailsFunc.get([1]).get('dateOfBirth');
    DOBControl.valueChanges.subscribe(
      value => {console.log(String("connected to password"));
                this.setMessage(RegisterType.DateOfBirth, DOBControl)}
    )

    const selectorControl = this.RegistrarDetailsFunc.get([2]).get('accountType');
    selectorControl.valueChanges.subscribe(
      value =>{
        console.log(String(value));
        this.setMessage(RegisterType.AccountType, selectorControl)
      }
    )

    const companyControl = this.RegistrarDetailsFunc.get([2]).get('companyName');
    companyControl.valueChanges.subscribe(
      value => {console.log(String("connected to password"));
                this.setMessage(RegisterType.CompanyName, companyControl)}
    )

    const allValidControl = this.RegistrarDetailsFunc.get([3]).get('allValid');
    allValidControl.valueChanges.subscribe(
      value => {console.log(String("connected to password"));
                this.setMessage(RegisterType.AllValid, allValidControl)}
    )

    const readTermsControl = this.RegistrarDetailsFunc.get([3]).get('readTerms');
    readTermsControl.valueChanges.subscribe(
      value => {console.log(String("connected to password"));
                this.setMessage(RegisterType.ReadTOS, readTermsControl)}
    )
  }
  
  setMessage(input:RegisterType, c:AbstractControl): void{
    console.log("Input = "+ input);
    switch(+input){ 

        case RegisterType.Email:
        this.emailMessage= '';
        if((c.touched || c.dirty) && c.errors){
          this.emailMessage = Object.keys(c.errors).map(
          key => this.validationMessageEmail[key]).join(' ');
        }
        break;

        case RegisterType.Username:
        this.usernameMessage= '';
        if((c.touched || c.dirty) && c.errors){
          this.usernameMessage = Object.keys(c.errors).map(
          key => this.validationMessagesUsername[key]).join(' ');
          }
          break;

        case RegisterType.Password:
        this.passwordMessage= '';
        if((c.touched || c.dirty) && c.errors){
          this.passwordMessage = Object.keys(c.errors).map(
          key => this.validationMessagesPassword[key]).join(' ');
        }
        break;

        case RegisterType.FirstName:
        this.firstNameMessage= '';
        if((c.touched || c.dirty) && c.errors){
          this.firstNameMessage = Object.keys(c.errors).map(
          key => this.validationMessageFirstName[key]).join(' ');
        }
        break;

        case RegisterType.LastName:
        this.lastNameMessage= '';
        if((c.touched || c.dirty) && c.errors){
          this.lastNameMessage = Object.keys(c.errors).map(
          key => this.validationMessageLastName[key]).join(' ');
        }
        break;
        
        case RegisterType.DateOfBirth:
        this.dateOfBirthMessage= '';
        if((c.touched || c.dirty) && c.errors){
          this.dateOfBirthMessage = Object.keys(c.errors).map(
          key => this.validationMessageDOB[key]).join(' ');
        }
        break;

        case RegisterType.DateOfBirth:
        this.dateOfBirthMessage= '';
        if((c.touched || c.dirty) && c.errors){
          this.dateOfBirthMessage = Object.keys(c.errors).map(
          key => this.validationMessageDOB[key]).join(' ');
        }
        break;

      case RegisterType.AccountType:
        this.accountTypeMessage= '';
        if((c.touched || c.dirty) && c.errors){
          this.accountTypeMessage = Object.keys(c.errors).map(
          key => this.validationMessageAccountType[key]).join(' ');
        }
      break;
      case RegisterType.CompanyName:
        this.companyNameMessage= '';
        if((c.touched || c.dirty) && c.errors){
          this.companyNameMessage = Object.keys(c.errors).map(
          key => this.validationMessageCompanyName[key]).join(' ');
        }
        break;

        case RegisterType.AllValid:
        this.allValidMessage= '';
        if((c.touched || c.dirty) && c.errors){
          this.allValidMessage = Object.keys(c.errors).map(
          key => this.validationMessageAllValid[key]).join(' ');
        }
        break;

        case RegisterType.ReadTOS:
        this.TOSMessage= '';
        if((c.touched || c.dirty) && c.errors){
          this.TOSMessage = Object.keys(c.errors).map(
          key => this.validationMessageTOS[key]).join(' ');
        }
        break;

    }
    
  }

  save():void{

  }

}
