import {Injectable} from '@angular/core';
import {ICompany} from '../company';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ObjectConverter} from '../ObjectConverter/object-converter';

import {Observable, throwError, of } from 'rxjs';
import {catchError, tap, map, retry} from 'rxjs/operators';
import { CompanyServiceClient } from '../company-service-client/company-service-client';


@Injectable({
    providedIn: 'root'
})

export class CompanyService{

    private clientUrl  = '/api/companies';
    private otherServiceUrl = '/api/companiesClient';
    private trueUrl = 'https://localhost:44326/api/stocks';
    private ROOTURL = 'https://jsonplaceholder.typicode.com/';
    //companyClient:ICompanyView;
    //private clienturl2 = 'localhost:44326/api/controller'
    id:number = 5;

    constructor(private http: HttpClient, private companyServiceClient:CompanyServiceClient ){}

    //Modify this for the web server
    getCompanies():Observable<any>{
        //const headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.get<any>(this.clientUrl + '/posts',{observe: 'body', responseType: 'json'})
        .pipe(
            retry(3), //retry failed request up to three times
            tap(data => console.log('getCompanies: ' + JSON.stringify(data))),
            map(companies => ObjectConverter.ConvertArrayProvider(companies,"id")), //console.log(companies)),
            catchError(this.handleError)
        ); 
    }

    //Modify this for the web server
    getCompany(ids:number):Observable<ICompany>{
        //const headers = new HttpHeaders({'Content-Type': 'application/json'});
        console.log("using getcompany function");
        console.log(`id equals ${ids}`);
        if(ids != 0){
            const url = `${this.clientUrl}/${ids}/`;
            return this.http.get<ICompany>(url)
            .pipe(
                tap(data => console.log('getCompany: ' + JSON.stringify(data))),
                map(company => ObjectConverter.ConvertProvider(company,"id")),
                catchError(this.handleError)
            );
        }

    }

    //Modify this for the web server
    //modify an existing company
    modifyCompany(company:ICompany): Observable<any>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        const url = `${this.clientUrl}/${company.id}`;
        //CHANGE THE CONVERTPROVIDER DEPENDING ON IF IT'S GONG TO THE BACKEND OR NOT
        var companySend = ObjectConverter.ConvertProvider(company, "id"); 
        return this.http.put<ICompany>(url, companySend, {headers: headers})
        .pipe(
            tap(() => console.log('modifyCompany: ' + company.id)),
            map(()=> companySend),
            catchError(this.handleError)
        );
    }

    addCompany(company:any): Observable<any>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        //REMOVE THIS DEPENDING ON IF YOU ARE SENDING TO THE BACKEND OR NOT
        this.id +=1;
        //DELETE THE LINE BELOW IF YOU ARE SENDING TO THE BACKEND
        company.id = this.id;
        //change for backend
        var companySend = ObjectConverter.ConvertProvider(company, "id"); 
        console.log("I am here!");
        //CHANGE THIS WHEN YOU ARE IMPLEMENTING THE BACKEND, THIS JUST CONNECTS THE TWO DATABASES TOGETHER.
        this.companyServiceClient.addCompanyClient(companySend)
        .subscribe();

        console.log("I am here too!");
        return this.http.post<ICompany>(this.clientUrl, companySend, {headers:headers})
        .pipe(
            tap(() => console.log('added company: ' + company.id)),
            map(()=> company),
            catchError(this.handleError)
        );
    }

    

    deleteCompany(id: number):Observable<{}>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        const url = `${this.clientUrl}/${id}`;
        this.companyServiceClient.deleteCompanyClient(id).subscribe();
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