import {Injectable} from '@angular/core';
import {ICompany} from '../company-models/company';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ObjectConverter} from '../ObjectConverter/object-converter';

import {Observable, throwError, of } from 'rxjs';
import {catchError, tap, map, retry} from 'rxjs/operators';
import { CompanyServiceClient } from '../company-service-client/company-service-client';
import { environment as env } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})

export class CompanyService{

    private clientUrl  = '/api/companies';
    private otherServiceUrl = '/api/companiesClient';
    private trueUrl = 'https://localhost:44326/api/stocks'; //This is the URL of the webapi. Change to match it
    private ROOTURL = 'https://jsonplaceholder.typicode.com/';
    //companyClient:ICompanyView;
    //private clienturl2 = 'localhost:44326/api/controller'
    id:number = 5;

    constructor(private http: HttpClient, private companyServiceClient:CompanyServiceClient ){}

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

    //Calls all the companies. 
    getCompanies():Observable<any>{
        //const headers = new HttpHeaders({'Content-Type': 'application/json'});
        //return this.http.get<any>(`${this.trueUrl}`,{observe: 'body', responseType: 'json'})
        return this.http.get<any>(`${env.dev.serverUrlProvider}/api/prices/latestinfo`,{observe: 'body', responseType: 'json'})
        .pipe(
            //retry(3), //retry failed request up to three times
            tap(data => console.log('getCompanies: ' + JSON.stringify(data))),
            /*map(companies => ObjectConverter.ConvertArrayProvider(companies,"id") console.log(companies)),*/
            catchError(this.handleError)
        ); 
    }

    //Modify this for the web server.Currently works but it does throw a typeerror eventhough it doesn't
    //impact how the code functions.
    getCompany(id:number):Observable<any>{
        //const headers = new HttpHeaders({'Content-Type': 'application/json'});
        console.log("using getcompany function");
        console.log(`id equals ${id}`);
        if(id != 0){
            const url = `${env.dev.serverUrlProvider}/api/prices/${id}/latestinfo`;
            return this.http.get<any>(url)
            .pipe(
                tap(data => console.log('getCompany: ' + JSON.stringify(data))),
                map(company => ObjectConverter.ConvertProvider(company,"id")),
                catchError(this.handleError)
            );
        }
    }

    //TODO: Implement this
    getCompaniesById(idArray:number[]){
        console.log("This function is not yet implemented yet!");
    }

    getCompanyHistory(id:number):Observable<any>{
        if(id != 0){
            const url = `${env.dev.serverUrlProvider}/api/Prices/${id}`;
            return this.http.get<any>(url)
            .pipe(
                tap(data => console.log('priceHistory: ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
        }
    }


    //Modify this for the web server
    //modify an existing company
    modifyCompany(company:ICompany): Observable<any>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        const url = `${this.trueUrl}/${company.id}`;
        //CHANGE THE CONVERTPROVIDER DEPENDING ON IF IT'S GONG TO THE BACKEND OR NOT
        var companySend = ObjectConverter.ConvertProvider(company, "id"); 
        return this.http.put<ICompany>(url, companySend, {headers: headers})
        .pipe(
            tap(() => console.log('modifyCompany: ' + company.id)),
            map(()=> companySend),
            catchError(this.handleError)
        );
    }

    createNewStock(name:string, abbr:string):Observable<any>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        var companyObj = { "name": name,
                            "abbr": abbr
                        };
        return this.http.post<ICompany>(`${env.dev.serverUrlProvider}/api/stocks/`, companyObj,{headers:headers})
        .pipe(
            tap(() => console.log('added company!')),
            map(()=> companyObj),
            catchError(this.handleError)
        );
    }

    //this adds a stock price to an already existing stock
    addStockPrice(stock_id:number, price:number):Observable<any>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        
        var priceObj = {
            "stock_id": stock_id,
            "time": new Date(),
            "value": price
        };
        return this.http.post<any>(`${env.dev.serverUrlProvider}/api/prices/`, priceObj,{headers:headers})
        .pipe(
            tap(() => console.log('added stock price!')),
            map(()=> priceObj),
            catchError(this.handleError)
        );
    }
    //TODO:IMPLEMENT THIS ONCE THE BACKEND HAS IT IMPLEMENTED
    updateStockName(id:number,name:string, abbr:string ):Observable<any>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        var stocksObj = {
            "id":id,
            "name":name,
            "abbr":abbr
        };


        //this.companyServiceClient.deleteCompanyClient(id).subscribe();
        return this.http.put<any>(`${env.dev.serverUrlProvider}/api/stocks/${id}`, stocksObj,{headers:headers})
        .pipe(
            tap(() => console.log('added stock price!')),
            map(()=> stocksObj),
            catchError(this.handleError)
        );
    }
    

    deleteCompany(id: number):Observable<{}>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        const url = `${env.dev.serverUrlProvider}/api/stocks/${id}`;
        //this.companyServiceClient.deleteCompanyClient(id).subscribe();
        return this.http.delete<ICompany>(url,{headers: headers});
    }


    initialiseCompany():ICompany{
        return {
            id:0,
            name: null,
            abbreviation: null,
            price: null,
            dateTime: null,
        }
    }

    initialisePrice():any{
        return {
            id:0,
            stock_id:null,
            time:null,
            value:null
        }
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