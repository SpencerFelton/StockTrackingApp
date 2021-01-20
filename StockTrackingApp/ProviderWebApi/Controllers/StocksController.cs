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
                objects.Add(new TransitStock(stock));
            }
            return objects;
        }

        // GET api/stocks/4
        public object Get(int id)
        {
            return new TransitStock(DBHandler.GetStock(id));
        }

        // POST api/stocks
        [HttpPost]
        public void Post([FromBody] TransitStock transitStock)
        {
            if (transitStock == null) throw new ArgumentNullException();
            DBHandler.AddStock(transitStock);
        }

        // PUT api/stocks/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/stocks/5
        public void Delete(int id)
        {
        }
    }
}