using SubscriberWebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Cors;

namespace SubscriberWebAPI.Controllers
{
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class StocksController : ApiController
    {
        // GET api/stocks
        public IEnumerable<TransitStock> GetAllStocks()
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
        public TransitStock GetStockByID(int id)
        {
            Stock stock = DBHandler.GetStock(id);
            if (stock == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            return new TransitStock(stock);
        }

        // GET api/stocks/ABBR
        public TransitStock GetStockByAbbreviation(string abbr)
        {
            Stock stock = DBHandler.GetStock(abbr);
            if (stock == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            return new TransitStock(stock);
        }
    }
}