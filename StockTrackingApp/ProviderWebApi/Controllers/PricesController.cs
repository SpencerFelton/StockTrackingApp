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
using System.Web.Http.Cors;

namespace ProviderWebApi.Controllers
{
    //[EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class PricesController : ApiController
    {
        private StockModel db = new StockModel();

        // GET: api/prices
        // GET: api/Prices
        public IQueryable<PriceHistory> GetPriceHistories()
        {
            return db.PriceHistories;
        }

        // GET: api/Prices/5
        [Route("api/prices/{stock_id}")]
        [ResponseType(typeof(PriceHistory))]
        public async Task<IHttpActionResult> GetStockPriceHistory(int stock_id)
        {
            List<PriceHistory> prices = await db.PriceHistories.Where(e => e.stock_id == stock_id).ToListAsync();
            if (prices == null)
            {
                return NotFound();
            }

            return Ok(prices);
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
        public async Task<IHttpActionResult> GetAllStocksWithLatestPrice()
        {
            /*
            List<Stock> stocks = await db.Stocks.ToListAsync();
            List<StockWithPrice> transits = new List<StockWithPrice>();

            foreach (Stock s in stocks)
            {
                PriceHistory latest = await db.PriceHistories.Where(e => e.stock_id == s.id).OrderByDescending(e => e.time).FirstOrDefaultAsync();
                StockWithPrice transit = new StockWithPrice(s, latest);
                transits.Add(transit);
            }

            if (transits == null)
                return NotFound();

            return Ok(transits);
            */
            List<Stock> stocks = await db.Stocks.ToListAsync();
            List<StockWithPrice> transits = new List<StockWithPrice>();

            foreach (Stock s in stocks)
            {
                PriceHistory latest = await db.PriceHistories.Where(e => e.stock_id == s.id).OrderByDescending(e => e.time).FirstOrDefaultAsync();
                StockWithPrice transit = new StockWithPrice(s, latest);
                transits.Add(transit);
            }

            if (transits == null)
                return NotFound();

            return Ok(transits);
        }

        // GET: api/Prices/5/latestinfo
        [HttpGet]
        [Route("api/prices/{stock_id}/latestinfo")]
        [ResponseType(typeof(PriceHistory))]
        public async Task<IHttpActionResult> GetStockWithLatestPrice(int stock_id)
        {
            Stock stock = await db.Stocks.FindAsync(stock_id);
            PriceHistory latest = await db.PriceHistories.Where(e => e.stock_id == stock.id).OrderByDescending(e => e.time).FirstOrDefaultAsync();
            StockWithPrice transit = new StockWithPrice(stock, latest);

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