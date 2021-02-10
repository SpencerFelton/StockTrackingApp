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

            return CreatedAtRoute("DefaultApi", new { id = priceHistory.id }, priceHistory);
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