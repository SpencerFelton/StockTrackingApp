import {Injectable} from '@angular/core';
import {ICompanyView} from '../company-models/companyView';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError, of } from 'rxjs';
import {catchError, tap, map} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class CompanyServiceClient{

    private clientUrl  = '/api/companiesClient'
    //private clienturl2 = 'localhost:44326/api/controller'
    id:number = 5;

    constructor(private http: HttpClient){}

    //Modify this for the web server
    getCompaniesClient():Observable<ICompanyView[]>{
        return this.http.get<ICompanyView[]>(this.clientUrl)
        .pipe(
            tap(data => console.log('getCompanies: ' + JSON.stringify(data))),
            catchError(this.handleError)
        ); 
    }

    //Modify this for the web server
    getCompanyClient(id:number):Observable<ICompanyView>{
        if(id != 0){
                    const url = `${this.clientUrl}/${id}`;
            return this.http.get<ICompanyView>(url)
            .pipe(
                tap(data => console.log('getCompany: ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
        }

    }
    
    //may not be how to actually do the call for subscribed companies
    getSubscribedCompanies():Observable<ICompanyView[]>{
        const url = `${this.clientUrl}?subscribed=true`;
        return this.http.get<ICompanyView[]>(url)
        .pipe(
            tap(data => console.log('getCompany: ' + JSON.stringify(data))),
            catchError(this.handleError)
        );
    }



    //THE FOLLOWING ARE THE CLIENT SPECIFIC. THESE ARE NOT DIRECTLY CALLED IN THE PROGRAM AND DONT HAVE A USE OUTSIDE OF DEMONSTRATION PURPOSES.
    //DONT TOUCH------------------------------------------------------------------------------------------------------------------------------------
    addCompanyClient(companyClient:any): Observable<any>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        companyClient.subscribed = false;
        companyClient.stocksPurchased = 0;
        console.log("I am here as well!");
        return this.http.post<any>(this.clientUrl, companyClient, {headers:headers})
        .pipe(
            tap(() => console.log('added company(CLIENT SIDE): ' + companyClient.id)),
            map(()=> companyClient),
            catchError(this.handleError)
        );
    }    
    
    modifyStockClient(company:any): Observable<any>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        const url = `${this.clientUrl}/${company.id}`;
        return this.http.put<any>(url, company, {headers: headers})
        .pipe(
            tap(() => console.log('modifyCompany: ' + company.id)),
            map(()=> company),
            catchError(this.handleError)
        );
    }
    
    deleteCompanyClient(id: number):Observable<{}>{
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        const url = `${this.clientUrl}/${id}`;
        return this.http.delete<any>(url,{headers: headers});
    }

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