import {ICompanyB} from './company-backend';

export interface ICompanyViewB extends ICompanyB{
    stock_id: number;
    name: string;
    abbreviation: string;
    price: number;
    dateTime: string;
    subscribed: boolean;
    stocksPurchased: number;
}