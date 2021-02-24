using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using SubscriberWebAPI.Models;

namespace SubscriberWebAPI.Controllers
{
    public class StocksController : ApiController
    {
        private ClientStockTrackerEntities db = new ClientStockTrackerEntities();

        // GET: api/Stocks
        [HttpGet]
        [Authorize]
        public IQueryable<Stock> GetStocks()
        {
            return db.Stocks;
        }

        // GET: api/Stocks/5
        [HttpGet]
        [Authorize]
        [ResponseType(typeof(Stock))]
        public async Task<IHttpActionResult> GetStock(int id)
        {
            Stock stock = await db.Stocks.FindAsync(id);
            if (stock == null)
            {
                return NotFound();
            }

            return Ok(stock);
        }

        // GET: api/Stocks/abbr
        [HttpGet]
        [Authorize]
        [ResponseType(typeof(Stock))]
        public async Task<IHttpActionResult> GetStock(string abbr)
        {
            Stock stock = await db.Stocks.FindAsync(abbr);
            if (stock == null)
            {
                return NotFound();
            }

            return Ok(stock);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StockExists(int id)
        {
            return db.Stocks.Count(e => e.id == id) > 0;
        }
    }
}