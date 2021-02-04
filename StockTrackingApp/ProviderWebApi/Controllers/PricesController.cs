using ProviderWebApi.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ProviderWebApi.Controllers
{
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class PricesController : ApiController
    {
        // GET api/prices
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

        // GET api/prices/price/5
        [HttpGet]
        [Route("api/prices/price/{id}")]
        public TransitStock GetPrice(int id)
        {
            PriceHistory priceHistory = DBHandler.GetPriceHistory(id);
            if (priceHistory == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            return new TransitStock(priceHistory);
        }

        // GET api/prices/latest
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
        [HttpGet]
        [Route("api/prices/latest/{id}")]
        public TransitStock GetLatest(int id)
        {
            Stock stock = DBHandler.GetStock(id);
            if (stock == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            PriceHistory priceHistory = DBHandler.GetMostRecentStockPriceHistory(stock);
            if (priceHistory == null) throw new HttpResponseException(HttpStatusCode.InternalServerError); // specifically, the db does not seem to have a price history for this stock - should be a necessity
            return new TransitStock(priceHistory);
        }

        // POST api/prices
        [HttpPost]
        public void Post([FromBody] TransitStock transitStock)
        {
            if (transitStock == null) throw new HttpResponseException(HttpStatusCode.BadRequest);
            DBHandler.UpdateStockPrice(transitStock); // may need to add a try-catch to return errors as status codes and stop the api breaking
            RabbitMQHandler.createUpdateStockPriceRMQMessage(transitStock); // may need to add a try catch to return errors as status codes and stop the api breaking
        }
    }
}