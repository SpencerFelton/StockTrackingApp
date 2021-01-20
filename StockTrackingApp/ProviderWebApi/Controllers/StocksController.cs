using ProviderAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProviderWebApi.Controllers
{
    public class StocksController : ApiController
    {
        // GET api/stocks
        public IEnumerable<object> Get()
        {
            IEnumerable<Stock> stocks = DBHandler.GetStocks();
            List<object> objects = new List<object>();
            foreach (Stock stock in stocks)
            {
                objects.Add(ToObject(stock));
            }
            return objects;
        }

        // GET api/stock/4
        public object Get(int id)
        {
            return ToObject(DBHandler.GetStock(id));
        }

        // POST api/stock
        public void Post([FromBody] string value)
        {
        }

        // PUT api/stock/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/stock/5
        public void Delete(int id)
        {
        }

        private object ToObject(Stock stock)
        {
            PriceHistory price = DBHandler.GetMostRecentStockPriceHistory(stock);
            return new
            {
                stock_id = stock.id,
                name = stock.name,
                abbreviation = stock.abbr,
                price = price.value,
                dateTime = price.time
            };
        }
        private object ToObject(PriceHistory price)
        {
            Stock stock = DBHandler.GetStock(price.stock_id);
            return new
            {
                stock_id = price.stock_id,
                name = stock.name,
                abbreviation = stock.abbr,
                price = price.value,
                dateTime = price.time
            };
        }
    }
}