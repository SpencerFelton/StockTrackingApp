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

        // POST api/stocks
        [HttpPost]
        public void Post([FromBody] TransitStock transitStock)
        {
            if (transitStock == null) throw new HttpResponseException(HttpStatusCode.BadRequest);
            DBHandler.AddStock(transitStock); // may need a try-catch to return errors as status codes and stop the api breaking
        }
    }
}