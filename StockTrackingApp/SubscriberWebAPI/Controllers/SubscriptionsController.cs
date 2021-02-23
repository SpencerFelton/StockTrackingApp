using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using SubscriberWebAPI.Models;

namespace SubscriberWebAPI.Controllers
{
    public class SubscriptionsController : ApiController
    {
        private ClientStockTrackerEntities db = new ClientStockTrackerEntities();

        // GET: api/Subscriptions
        public IQueryable<Subscription> GetSubscriptions()
        {
            return db.Subscriptions;
        }

        // GET: api/Subscriptions/5
        [ResponseType(typeof(Subscription))]
        public async Task<IHttpActionResult> GetSubscription(int id)
        {
            Subscription subscription = await db.Subscriptions.FindAsync(id);
            if (subscription == null)
            {
                return NotFound();
            }

            return Ok(subscription);
        }

        // POST: api/Subscriptions
        [ResponseType(typeof(Subscription))]
        public async Task<IHttpActionResult> PostSubscription(int stock_id)
        {
            HttpRequestHeaders header = this.Request.Headers;
            string user_id = string.Empty;

            if (header.Contains("sub"))
            {
                user_id = header.GetValues("sub").First();
            }

            Subscription sub = new Subscription(stock_id, user_id);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Subscriptions.Add(sub);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SubscriptionExists(sub.id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Ok(sub);
        }

        // DELETE: api/Subscriptions/5
        [ResponseType(typeof(Subscription))]
        public async Task<IHttpActionResult> DeleteSubscription(int id)
        {
            Subscription subscription = await db.Subscriptions.FindAsync(id);
            if (subscription == null)
            {
                return NotFound();
            }

            db.Subscriptions.Remove(subscription);
            await db.SaveChangesAsync();

            return Ok(subscription);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SubscriptionExists(int id)
        {
            return db.Subscriptions.Count(e => e.id == id) > 0;
        }
    }
}