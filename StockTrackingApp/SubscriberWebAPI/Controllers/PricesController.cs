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
    public class PricesController : ApiController
    {
        private ClientStockTracker db = new ClientStockTracker();

        // GET: api/Prices
        public IQueryable<PriceHistory> GetPriceHistories()
        {
            return db.PriceHistories;
        }

        // GET: api/Prices/5
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

        // PUT: api/Prices/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutPriceHistory(int id, PriceHistory priceHistory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != priceHistory.id)
            {
                return BadRequest();
            }

            db.Entry(priceHistory).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PriceHistoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Prices
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

        // DELETE: api/Prices/5
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

        public void AddPriceToDB(PriceHistory priceHistory)
        {
            db.PriceHistories.Add(priceHistory);
            db.SaveChanges();
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