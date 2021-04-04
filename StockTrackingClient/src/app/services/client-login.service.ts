import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ClientDetails} from '../models/client-details';


@Injectable({
    providedIn: 'root'
})

//This class stores all the information of the login instance
export class ClientLoginService implements ClientDetails{
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    DOB: string;
    phoneNo: string;
    subscribedStocks: string[];

    constructor(){}

    setUpLogin(clientLogin:ClientDetails):void{
        this.firstName = clientLogin.firstName;
        this.lastName = clientLogin.lastName;
        this.email = clientLogin.email;
        this.username = clientLogin.username;
        this.password = clientLogin.password;
        this.DOB = clientLogin.DOB;
        this.phoneNo = clientLogin.phoneNo;
        this.subscribedStocks = clientLogin.subscribedStocks;
    }

    getLoginInfo():ClientDetails{
        let clientInfo:ClientDetails = {
            "firstName":this.firstName,
            "lastName": this.lastName,
            "email":this.email,
            "username": this.username,
            "password" :this.password,
            "DOB": this.DOB,
            "phoneNo" :this.phoneNo,
            "subscribedStocks": this.subscribedStocks
        }

        return clientInfo;
    }


}