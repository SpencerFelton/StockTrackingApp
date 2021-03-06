﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using ProviderWebApi.Models;
using System.Web.Http.Cors;

namespace ProviderWebApi.Controllers
{
    //[EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class StocksController : ApiController
    {
        private StockModel db = new StockModel();

        // GET: api/Stocks
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

        // PUT: api/stocks/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutStock(int id, Stock stock)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != stock.id)
            {
                return BadRequest();
            }

            db.Entry(stock).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StockExists(id))
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

        // POST: api/stocks
        [ResponseType(typeof(Stock))]
        public async Task<IHttpActionResult> PostStock(Stock stock)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Stocks.Add(stock);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = stock.id }, stock);
        }

        // DELETE: api/Stocks/5
        [ResponseType(typeof(Stock))]
        public async Task<IHttpActionResult> DeleteStock(int id)
        {
            Stock stock = await db.Stocks.FindAsync(id);
            if (stock == null)
            {
                return NotFound();
            }

            db.Stocks.Remove(stock);
            db.PriceHistories.RemoveRange(db.PriceHistories.Where(e => e.stock_id == stock.id));
            await db.SaveChangesAsync();

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