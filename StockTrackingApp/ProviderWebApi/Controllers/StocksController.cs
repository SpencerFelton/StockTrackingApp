using ProviderWebApi.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ProviderWebApi.Controllers
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

        // GET api/stocks/id
        public TransitStock GetStockByID(int id)
        {
            Stock stock = DBHandler.GetStock(id);
            if (stock == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            return new TransitStock(stock);
        }

        // POST api/stocks
        // Post method to add new stock by name and abbreviation
        [HttpPost]
        public void AddStock([FromBody] Stock stock)
        {
            if (stock == null) throw new HttpResponseException(HttpStatusCode.BadRequest);
            DBHandler.AddStock(stock); // may need a try-catch to return errors as status codes and stop the api breaking
            RabbitMQHandler.createAddNewStockRMQMessage(stock); // may need a try-catch to return errors as status codes and stop the api breaking
        }

        // DELETE api/stocks/id
        // Delete method to delete stock by ID
        public void DeleteStock(int id)
        {
            Stock stock = DBHandler.GetStock(id);
            if (stock == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            DBHandler.DeleteStock(id);
            RabbitMQHandler.createDeleteStockRMQMessage(stock);
        }

        // PUT api/stocks/id
        // Put method to modify stock, referenced by ID along with new name and abbreviation
        [HttpPut]
        public void ModifyStock([FromBody]Stock stock)
        {
            if (stock == null) throw new HttpResponseException(HttpStatusCode.BadRequest);
            DBHandler.ModifyStock(stock);
            RabbitMQHandler.createModifyStockRMQMessage(stock); // may need a try-catch to return errors as status codes and stop the api breaking
        }
    }
}