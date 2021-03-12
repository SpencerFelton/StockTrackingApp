import {Injectable} from '@angular/core';
import {ICompanyView} from '../company-models/companyView';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError, of } from 'rxjs';
import {catchError, tap, map} from 'rxjs/operators';
import {AuthService} from '@auth0/auth0-angular';

import { environment as env } from '../../../environments/environment';

//NOTE: THIS IS NOT A PERMINANT SOLUTION. THIS IS SOMETHING THAT WILL EXIST IN 
//THE FUTURE VERSION OF IT. IT WILL BE A PART OF A NEW WEBAPI

@Injectable({
    providedIn: 'root'
})

export class AccountService{

    constructor(public auth: AuthService,
                public http:HttpClient){

    }

    changePassword(email:string):Observable<any>{
        var url = `https://${env.auth.domain}/dbconnections/change_password`;
        
        console.log(`Here is your email: ${email}`);
        var  data = {
           client_id: env.auth.clientId,
           email:email,
           connection:"Username-Password-Authentication"
        };
        return this.http.post<any>(url,data)
        .pipe(
            tap(data => console.log('getCompanies(1): ' + JSON.stringify(data))),
            catchError(this.handleError)
        ); 
    }

    private handleError(err: HttpErrorResponse){

        let errorMessage = '';
        if(err.error instanceof ErrorEvent){
            errorMessage = `An error occured: ${err.error.message}`;
        }else{
            errorMessage = `Server returned code: ${err.status}, error message
            is: ${err.message}`; 
        }
        console.error(errorMessage);
        return throwError(errorMessage)
    }

}