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
        public IEnumerable<TransitStock> GetAllPriceHistories()
        {
            PriceHistory[] priceHistories = StockDBHandler.GetPriceHistories();
            List<TransitStock> transitStocks = new List<TransitStock>();
            foreach (PriceHistory priceHistory in priceHistories)
            {
                transitStocks.Add(new TransitStock(priceHistory));
            }
            return transitStocks;
        }

        // GET api/prices/5
        // Get full stock price history for a single stock by ID
        public IEnumerable<TransitStock> GetStockPriceHistory(int id)
        {
            Stock stock = StockDBHandler.GetStock(id);
            if (stock == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            PriceHistory[] priceHistories = StockDBHandler.GetPriceHistories(stock);
            if (priceHistories.Length == 0) throw new HttpResponseException(HttpStatusCode.InternalServerError); // specifically, the db does not seem to have a price history for this stock - should be a necessity
            List<TransitStock> transitStocks = new List<TransitStock>();
            foreach (PriceHistory priceHistory in priceHistories)
            {
                transitStocks.Add(new TransitStock(priceHistory));
            }
            return transitStocks;
        }

        // GET api/prices/ABBR
        // Get a full stock price history for a single stock by abbreviation
        public IEnumerable<TransitStock> GetCurrentPrice(string abbr)
        {
            Stock stock = StockDBHandler.GetStock(abbr);
            if (stock == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            PriceHistory[] priceHistories = StockDBHandler.GetPriceHistories(stock);
            if (priceHistories.Length == 0) throw new HttpResponseException(HttpStatusCode.InternalServerError); // specifically, the db does not seem to have a price history for this stock - should be a necessity
            List<TransitStock> transitStocks = new List<TransitStock>();
            foreach (PriceHistory priceHistory in priceHistories)
            {
                transitStocks.Add(new TransitStock(priceHistory));
            }
            return transitStocks;
        }

        // GET api/prices/price/5
        // Get a single price update by ID
        [HttpGet]
        [Route("api/prices/price/{price_id}")]
        public TransitStock GetSinglePrice(int price_id)
        {
            PriceHistory priceHistory = StockDBHandler.GetPriceHistory(id);
            if (priceHistory == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            return new TransitStock(priceHistory);
        }

        // GET api/prices/price
        [HttpGet]
        [Route("api/prices/price")]
        public TransitStock GetPrice([FromBody] TransitStock transitStock)
        {
            PriceHistory priceHistory = StockDBHandler.GetPriceHistory(transitStock.abbreviation, transitStock.dateTime);
            if (priceHistory == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            return new TransitStock(priceHistory);
        }

        // GET api/prices/latest
        // Get the latest price for all stocks
        [HttpGet]
        [Route("api/prices/latest")]
        public IEnumerable<TransitStock> GetLatestPriceAllStocks()
        {
            Stock[] stocks = StockDBHandler.GetStocks();
            List<TransitStock> transitStocks = new List<TransitStock>();
            foreach (Stock stock in stocks)
            {
                PriceHistory priceHistory = StockDBHandler.GetMostRecentStockPriceHistory(stock);
                if (priceHistory == null) throw new HttpResponseException(HttpStatusCode.InternalServerError); // specifically, the db does not seem to have a price history for this stock - should be a necessity
                transitStocks.Add(new TransitStock(priceHistory));
            }
            return transitStocks;
        }

        // GET api/prices/latest/5
        // Get the current value of a stock by its stock id
        [HttpGet]
        [Route("api/prices/latest/{stock_id}")]
        public TransitStock GetStockLatestPrice(int stock_id)
        {
            Stock stock = StockDBHandler.GetStock(id);
            if (stock == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            PriceHistory priceHistory = StockDBHandler.GetMostRecentStockPriceHistory(stock);
            if (priceHistory == null) throw new HttpResponseException(HttpStatusCode.InternalServerError); // specifically, the db does not seem to have a price history for this stock - should be a necessity
            return new TransitStock(priceHistory);
        }
    }
}