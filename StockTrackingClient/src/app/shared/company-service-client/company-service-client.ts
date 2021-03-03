import {Injectable} from '@angular/core';
import {ICompanyView} from '../company-models/companyView';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError, of } from 'rxjs';
import {catchError, tap, map} from 'rxjs/operators';

import { environment as env } from '../../../environments/environment';



@Injectable({
    providedIn: 'root'
})

export class CompanyServiceClient{

    private clientUrl  = '/api/companiesClient';
    private clienturl2 = 'https://localhost:44353/api/stocks';
    private pricehistoryUrl = 'https://localhost:44353/api/prices';
    private clienturl3 = 'https://localhost:44353';
    //id:number = 5;

    constructor(private http: HttpClient){}

    logIn():Observable<any>{
        console.log("not implemented");
        //this class accepts an email
        //it is a get request that gets the login information of the login email
        //if the backend server can find the login information
            //add information to clientLogin.service
            //return a 1 that can then be used for the login page (say that you have sucessfully logged in or something)
        //if it can't
            //Throw an exception
            //return a 0 basically saying that you don't have an account. Sign up!
        return;
    }

    register():Observable<any>{
        console.log("not implemented");
        return;
    }




    //Modify this for the web server
    getCompaniesClient():Observable<any[]>{
        console.log("Getting companies as the client...");
        /*
        return this.http.get<ICompanyView[]>(`${env.dev.serverUrl}/api/stocks`)
        .pipe(
            tap(data => console.log('getCompanies: ' + JSON.stringify(data))),
            catchError(this.handleError)
        ); 
        */
        
       
       return this.http.get<any[]>(`${env.dev.serverUrlClient}/api/prices/latestinfo`)
        .pipe(
            tap(data => console.log('getCompanies(1): ' + JSON.stringify(data))),
            catchError(this.handleError)
        ); 

        
    }

    //Modify this for the web server
    getCompanyClient(id:number):Observable<ICompanyView>{
        if(id != 0){
            const url = `${env.dev.serverUrlClient}/api/prices/${id}/latestinfo`;
            return this.http.get<ICompanyView>(url)
            .pipe(
                tap(data => console.log('getCompany(2): ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
        }
    }

    getCompanyClientHistory(id:number):Observable<any>{
        if(id != 0){
            const url = `${env.dev.serverUrlClient}/api/Prices/${id}`;
            return this.http.get<any>(url)
            .pipe(
                tap(data => console.log('priceHistory: ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
        }
    }
    
    //may not be how to actually do the call for subscribed companies
    getSubscribedCompanies():Observable<any>{
        const url = `${env.dev.serverUrlClient}/api/Subscriptions/ViewAll`;
        return this.http.get<any>(url)
        .pipe(
            tap(data => console.log('get subscribed companies: ' + JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    subscribeToStock(stock_id:number){
        console.log("50");
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.post<any>(`${env.dev.serverUrlClient}/api/subscriptions/${stock_id}`,{headers:headers})
        .pipe(
            tap(() => console.log('subscribed to stock!')),
            catchError(this.handleError)
        );

    }

    unsubscribeToStock(stock_id:number){
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.delete<any>(`${env.dev.serverUrlClient}/api/subscriptions/${stock_id}`,{headers:headers})
        .pipe(
            tap(() => console.log('unsubscribed to stock!')),
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