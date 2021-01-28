using SubscriberWebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SubscriberWebAPI.Controllers
{
    public class StocksController : ApiController
    {
        // GET api/stocks
        public IEnumerable<TransitStock> Get()
        {
            Stock[] stocks = DBHandler.GetStocks();
            List<TransitStock> transitStocks = new List<TransitStock>();
            foreach (Stock stock in stocks)
            {
                transitStocks.Add(new TransitStock(stock));
            }
            return transitStocks;
        }

        // GET api/stocks/4
        public TransitStock Get(int id)
        {
            Stock stock = DBHandler.GetStock(id);
            if (stock == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            return new TransitStock(stock);
        }

        // GET api/stocks/ABBR
        public TransitStock Get(string abbr)
        {
            Stock stock = DBHandler.GetStock(abbr);
            if (stock == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            return new TransitStock(stock);
        }
    }
}