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
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            IEnumerable<Stock> stocks = DBHandler.GetStocks();
            List<string> strings = new List<string>();
            foreach (Stock stock in stocks)
            {
                strings.Add($"id={stock.id}, name={stock.name}, abbreviation={stock.abbr}");
            }
            return strings;
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}