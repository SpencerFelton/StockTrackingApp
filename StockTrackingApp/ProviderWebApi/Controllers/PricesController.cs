﻿using ProviderAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProviderWebApi.Controllers
{
    public class PricesController : ApiController
    {
        // GET api/prices
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/prices/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/prices
        [HttpPost]
        public void Post([FromBody] TransitStock transitStock)
        {
            if (transitStock == null) throw new ArgumentNullException();
            DBHandler.UpdateStockPrice(transitStock);
            RabbitMQHandler.SendStockPrice(transitStock);
        }

        // PUT api/prices/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/prices/5
        public void Delete(int id)
        {
        }
    }
}