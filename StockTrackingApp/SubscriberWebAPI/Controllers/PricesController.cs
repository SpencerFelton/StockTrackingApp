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
    public class PricesController : ApiController
    {
        // GET api/prices
        // Get full price history of all stocks
        public IEnumerable<TransitStock> Get()
        {
            PriceHistory[] priceHistories = DBHandler.GetPriceHistories();
            List<TransitStock> transitStocks = new List<TransitStock>();
            foreach (PriceHistory priceHistory in priceHistories)
            {
                transitStocks.Add(new TransitStock(priceHistory));
            }
            return transitStocks;
        }

        // GET api/prices/5
        // Get full stock price history by stock ID
        public IEnumerable<TransitStock> Get(int id)
        {
            Stock stock = DBHandler.GetStock(id);
            if (stock == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            PriceHistory[] priceHistories = DBHandler.GetPriceHistories(stock);
            if (priceHistories.Length == 0) throw new HttpResponseException(HttpStatusCode.InternalServerError); // specifically, the db does not seem to have a price history for this stock - should be a necessity
            List<TransitStock> transitStocks = new List<TransitStock>();
            foreach (PriceHistory priceHistory in priceHistories)
            {
                transitStocks.Add(new TransitStock(priceHistory));
            }
            return transitStocks;
        }

        // GET api/prices/ABBR
        // Get a full stock price history by stock abbreviation
        public IEnumerable<TransitStock> Get(string abbr)
        {
            Stock stock = DBHandler.GetStock(abbr);
            if (stock == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            PriceHistory[] priceHistories = DBHandler.GetPriceHistories(stock);
            if (priceHistories.Length == 0) throw new HttpResponseException(HttpStatusCode.InternalServerError); // specifically, the db does not seem to have a price history for this stock - should be a necessity
            List<TransitStock> transitStocks = new List<TransitStock>();
            foreach (PriceHistory priceHistory in priceHistories)
            {
                transitStocks.Add(new TransitStock(priceHistory));
            }
            return transitStocks;
        }

        // GET api/prices/price/5
        // Get a stock at a certain time by its price_id
        [HttpGet]
        [Route("api/prices/price/{price_id}")]
        public TransitStock GetPrice(int price_id)
        {
            PriceHistory priceHistory = DBHandler.GetPriceHistory(price_id);
            if (priceHistory == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            return new TransitStock(priceHistory);
        }

        // GET api/prices/latest
        // Get the latest price for all stocks
        [HttpGet]
        [Route("api/prices/latest")]
        public IEnumerable<TransitStock> GetLatest()
        {
            Stock[] stocks = DBHandler.GetStocks();
            List<TransitStock> transitStocks = new List<TransitStock>();
            foreach (Stock stock in stocks)
            {
                PriceHistory priceHistory = DBHandler.GetMostRecentStockPriceHistory(stock);
                if (priceHistory == null) throw new HttpResponseException(HttpStatusCode.InternalServerError); // specifically, the db does not seem to have a price history for this stock - should be a necessity
                transitStocks.Add(new TransitStock(priceHistory));
            }
            return transitStocks;
        }

        // GET api/prices/latest/5
        // Get a the current value of a stock by its stock id
        [HttpGet]
        [Route("api/prices/latest/{stock_id}")]
        public TransitStock GetLatest(int stock_id)
        {
            Stock stock = DBHandler.GetStock(stock_id);
            if (stock == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            PriceHistory priceHistory = DBHandler.GetMostRecentStockPriceHistory(stock);
            if (priceHistory == null) throw new HttpResponseException(HttpStatusCode.InternalServerError); // specifically, the db does not seem to have a price history for this stock - should be a necessity
            return new TransitStock(priceHistory);
        }
    }
}