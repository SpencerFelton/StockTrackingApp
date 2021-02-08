import {InMemoryDbService} from 'angular-in-memory-web-api';

import {ICompany} from './company-models/company';
import {ICompanyView} from './company-models/companyView';

export class CompanyData implements InMemoryDbService{
    
    createDb(){
        let companies:ICompany[] = [
            {
                id:1,
                name: "Chair Industries",
                abbreviation:"CHIN",
                price: 123.00,
                dateTime: "2020-01-20T12:28:30"
            },
            {
                id:2,
                name: "Capita",
                abbreviation:"CAPA",
                price: 482.00,
                dateTime: "2020-01-20T12:28:30"
            },
            {
                id:3,
                name: "Microsoft",
                abbreviation:"MSFT",
                price: 800.00,
                dateTime: "2020-01-20T12:28:30"
            },
            {
                id:4,
                name: "Ramen Studios",
                abbreviation:"RAMN",
                price: 135.00,
                dateTime: "2020-01-20T12:28:30"
            },
            {
                id:5,
                name: "Wallem Company",
                abbreviation:"WALM",
                price: 903.00,
                dateTime: "2020-01-20T12:28:30"
            }
        ]
        let companiesClient:ICompanyView[] = [
            {
                id:1,
                name: "Chair Industries",
                abbreviation:"CHIN",
                price: 123.00,
                dateTime: "2020-01-20T12:28:30",
                subscribed:false,
                stocksPurchased: 0
            },
            {
                id:2,
                name: "Capita",
                abbreviation:"CAPA",
                price: 482.00,
                dateTime: "2020-01-20T12:28:30",
                subscribed:false,
                stocksPurchased: 0
            },
            {
                id:3,
                name: "Microsoft",
                abbreviation:"MSFT",
                price: 800.00,
                dateTime: "2020-01-20T12:28:30",
                subscribed:false,
                stocksPurchased: 0
            },
            {
                id:4,
                name: "Ramen Studios",
                abbreviation:"RAMN",
                price: 135.00,
                dateTime: "2020-01-20T12:28:30",
                subscribed:false,
                stocksPurchased: 0
            },
            {
                id:5,
                name: "Wallem Company",
                abbreviation:"WALM",
                price: 903.00,
                dateTime: "2020-01-20T12:28:30",
                subscribed:false,
                stocksPurchased: 0
            }
        ]

        let registration

        return {companies, companiesClient};
    }
}