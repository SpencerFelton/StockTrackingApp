using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using ProviderWebApi.Models;

namespace ProviderWebApi.Controllers
{
    public class PricesController : ApiController
    {
        private StockModel db = new StockModel();

        // GET: api/prices
        public IQueryable<PriceHistory> GetPriceHistories()
        {
            return db.PriceHistories;
        }

        // GET: api/prices/5
        [ResponseType(typeof(PriceHistory))]
        public async Task<IHttpActionResult> GetPriceHistory(int id)
        {
            PriceHistory priceHistory = await db.PriceHistories.FindAsync(id);
            if (priceHistory == null)
            {
                return NotFound();
            }

            return Ok(priceHistory);
        }

        // GET: api/Prices/Latest
        [Route("api/prices/latest")]
        [ResponseType(typeof(PriceHistory))]
        public async Task<IHttpActionResult> GetLatestPrices()
        {
            List<PriceHistory> priceHistories = await db.PriceHistories.GroupBy(e => e.stock_id).Select(f => f.OrderByDescending(g => g.time).FirstOrDefault()).ToListAsync();
            if (priceHistories == null)
            {
                return NotFound();
            }

            return Ok(priceHistories);
        }

        // GET: api/Prices/5/Latest
        [Route("api/prices/{stock_id}/latest")]
        [ResponseType(typeof(PriceHistory))]
        public async Task<IHttpActionResult> GetStockLatestPrice(int stock_id)
        {
            PriceHistory priceHistory = await db.PriceHistories.Where(e => e.stock_id == stock_id).OrderByDescending(e => e.time).FirstOrDefaultAsync();
            if (priceHistory == null)
            {
                return NotFound();
            }

            return Ok(priceHistory);
        }

        // GET: api/Prices/Latestinfo
        [Route("api/prices/latestinfo")]
        [ResponseType(typeof(PriceHistory))]
        public async Task<IHttpActionResult> GetLatestPricesAndStock()
        {
            List<Stock> stocks = await db.Stocks.ToListAsync();
            List<TransitStock> transits = new List<TransitStock>();

            foreach (Stock s in stocks)
            {
                TransitStock tran = new TransitStock(s);
                transits.Add(tran);
            }

            if (transits == null)
                return NotFound();

            return Ok(transits);
        }

        // GET: api/Prices/5/latestinfo
        [Route("api/prices/{stock_id}/latestinfo")]
        [ResponseType(typeof(PriceHistory))]
        public async Task<IHttpActionResult> GetLatestPriceAndStock(int id)
        {
            Stock stock = await db.Stocks.FindAsync(id);
            PriceHistory priceHistory = await db.PriceHistories.FirstOrDefaultAsync(e => e.stock_id == stock.id);
            TransitStock transit = new TransitStock(stock, priceHistory);

            if (transit == null)
                return NotFound();

            return Ok(transit);
        }

        // POST: api/prices
        [ResponseType(typeof(PriceHistory))]
        public async Task<IHttpActionResult> PostPriceHistory(PriceHistory priceHistory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.PriceHistories.Add(priceHistory);
            await db.SaveChangesAsync();

            return Ok(priceHistory);
        }

        // DELETE: api/prices/5
        [ResponseType(typeof(PriceHistory))]
        public async Task<IHttpActionResult> DeletePriceHistory(int id)
        {
            PriceHistory priceHistory = await db.PriceHistories.FindAsync(id);
            if (priceHistory == null)
            {
                return NotFound();
            }               

            db.PriceHistories.Remove(priceHistory);
            await db.SaveChangesAsync();

            return Ok(priceHistory);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }

            base.Dispose(disposing);
        }

        private bool PriceHistoryExists(int id)
        {
            return db.PriceHistories.Count(e => e.id == id) > 0;
        }
    }
}