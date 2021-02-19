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
    private clienturl2 = 'https://localhost:44326/api/stocks';
    private pricehistoryUrl = 'https://localhost:44353/api/prices'
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
    getCompaniesClient():Observable<ICompanyView[]>{
        console.log("Getting companies as the client...");
        /*
        return this.http.get<ICompanyView[]>(`${env.dev.serverUrl}/api/stocks`)
        .pipe(
            tap(data => console.log('getCompanies: ' + JSON.stringify(data))),
            catchError(this.handleError)
        ); 
        */
        
       
       return this.http.get<ICompanyView[]>(`${this.clienturl2}`)
        .pipe(
            tap(data => console.log('getCompanies: ' + JSON.stringify(data))),
            catchError(this.handleError)
        ); 

        
    }

    //Modify this for the web server
    getCompanyClient(id:number):Observable<ICompanyView>{
        if(id != 0){
            const url = `${this.clienturl2}/${id}`;
            return this.http.get<ICompanyView>(url)
            .pipe(
                tap(data => console.log('getCompany: ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
        }

    }

    getCompanyClientHistory(id:number):Observable<any>{
        if(id != 0){
            const url = `${this.pricehistoryUrl}/${id}`;
            return this.http.get<any>(url)
            .pipe(
                tap(data => console.log('priceHistory: ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
        }
    }
    
    //may not be how to actually do the call for subscribed companies
    getSubscribedCompanies():Observable<ICompanyView[]>{
        const url = `${this.clienturl2}?subscribed=true`;
        return this.http.get<ICompanyView[]>(url)
        .pipe(
            tap(data => console.log('getCompany: ' + JSON.stringify(data))),
            catchError(this.handleError)
        );
    }



    //THE FOLLOWING ARE THE CLIENT SPECIFIC. THESE ARE NOT DIRECTLY CALLED IN THE PROGRAM AND DONT HAVE A USE OUTSIDE OF DEMONSTRATION PURPOSES.
    //DONT TOUCH------------------------------------------------------------------------------------------------------------------------------------
    /*
    addCompanyClient(companyClient:any): Observable<any>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        companyClient.subscribed = false;
        companyClient.stocksPurchased = 0;
        console.log("I am here as well!");
        return this.http.post<any>(this.clienturl2, companyClient, {headers:headers})
        .pipe(
            tap(() => console.log('added company(CLIENT SIDE): ' + companyClient.id)),
            map(()=> companyClient),
            catchError(this.handleError)
        );
    }    
    
    modifyStockClient(company:any): Observable<any>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        const url = `${this.clienturl2}/${company.id}`;
        return this.http.put<any>(url, company, {headers: headers})
        .pipe(
            tap(() => console.log('modifyCompany: ' + company.id)),
            map(()=> company),
            catchError(this.handleError)
        );
    }
    
    deleteCompanyClient(id: number):Observable<{}>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        const url = `${this.clienturl2}/${id}`;
        return this.http.delete<any>(url,{headers: headers});
    }
    */
    //-------------------------------------------------------------------------------------------------------------------------------------------------------




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