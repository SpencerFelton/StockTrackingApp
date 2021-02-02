import {ICompany} from './company';

export interface ICompanyView extends ICompany{
    id: number;
    name: string;
    abbreviation: string;
    price: number;
    dateTime: string;
    subscribed: boolean;
    stocksPurchased: number;
}