//This monstrocity was made because in-memory-web-api expects a primary key
//that is different to the stuff that the backend uses. Becuase of this, 
//it became increasingly apparent that there needs to be a way to convert between different
//objects representing stocks. This is bullshit, but it needs to be done. This is made even worse because JS
//doesn't support function overloading.

//import {IObject} from './TestObject';
import {ICompany} from '../company-models/company';
import {ICompanyB} from '../company-models/company-backend';


export class ObjectConverter{

    constructor(){}
    //This convert changes any stock object from a type that objectFrom uses to the type that objectTo uses. 
    static ConvertProvider(objectFrom: any, convertIdTo:string):any{
        if(objectFrom.hasOwnProperty("stock_id") && convertIdTo=="id"){
           var objectA = {
            "id":objectFrom.stock_id,
            "name": objectFrom.name,
            "abbreviation":objectFrom.abbreviation,
            "price":objectFrom.price,
            "dateTime": objectFrom.dateTime
            }; 
            return objectA;
        }else if(objectFrom.hasOwnProperty("id") && convertIdTo=="stock_id"){
            var objectB = {
                "stock_id":objectFrom.id,
                "name": objectFrom.name,
                "abbreviation":objectFrom.abbreviation,
                "price":objectFrom.price,
                "dateTime": objectFrom.dateTime
            };
            return objectB;
        }else{
            return objectFrom;
        }      
    }


    static ConvertArrayProvider(objectFrom: any[], convertIdTo:string):any[]{
        var length = objectFrom.length;
        console.log("Length is " + length);
        //check if ObjectFrom and objectTo has the properties you want
        if(objectFrom[0].hasOwnProperty("stock_id") && convertIdTo=="id"){
            console.log("This is working");
            var objectA:ICompany[] = [];
            for(var i = 0; i<length; i++){
                console.log("pushed " + i + " times");
                objectA.push({
                "id":objectFrom[i].stock_id,
                "name": objectFrom[i].name,
                "abbreviation":objectFrom[i].abbreviation,
                "price":objectFrom[i].price,
                "dateTime": objectFrom[i].dateTime
                }); 
            }   
             return objectA;
         }else if(objectFrom[0].hasOwnProperty("id") && convertIdTo=="stock_id"){
            let objectB:ICompanyB[] = [];
            for(var i = 0; i<length; i++){
                objectB.push({
                "stock_id":objectFrom[i].id,
                "name": objectFrom[i].name,
                "abbreviation":objectFrom[i].abbreviation,
                "price":objectFrom[i].price,
                "dateTime": objectFrom[i].dateTime
                }); 
            }   
             return objectB;
         }else{
             return objectFrom;
         }
    }

}