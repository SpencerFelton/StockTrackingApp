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
        private String UserIDFieldName = "sub";

        // GET: api/Subscriptions
        public IQueryable<Subscription> GetSubscriptions()
        {
            return db.Subscriptions;
        }

        // GET: api/Subscriptions/5
        [Route("api/subscriptions/{stock_id}")]
        [ResponseType(typeof(Subscription))]
        public async Task<IHttpActionResult> GetUserSubscriptionByStockID(int stock_id)
        {
            string user_id = getUserIDFromHeader(this.Request.Headers);

            Subscription subscription = await db.Subscriptions.Where(e => e.stock_id == stock_id && e.user_id == user_id).FirstOrDefaultAsync();

            if (subscription == null)
            {
                return NotFound();
            }

            return Ok(subscription);
        }

        // GET: api/Subscriptions/5
        [Route("api/subscriptions/ViewAll")]
        [ResponseType(typeof(Subscription))]
        public async Task<IHttpActionResult> GetAllUserSubscriptions()
        {
            string user_id = getUserIDFromHeader(this.Request.Headers);

            List<Subscription> subscriptions = await db.Subscriptions.Where(e => e.user_id == user_id).ToListAsync();

            if (subscriptions == null)
            {
                return NotFound();
            }

            return Ok(subscriptions);
        }

        // POST: api/Subscriptions/5
        [Route("api/subscriptions/{stock_id}")]
        [ResponseType(typeof(Subscription))]
        public async Task<IHttpActionResult> PostSubscription(int stock_id)
        {
            string user_id = getUserIDFromHeader(this.Request.Headers);

            if (user_id == "")
            {
                return Content(HttpStatusCode.BadRequest, "No user ID found in request header");
            }

            Subscription sub = new Subscription { stock_id = stock_id, user_id = user_id };

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (StockExists(stock_id))
            {
                db.Subscriptions.Add(sub);
            }
            else
            {
                return Content(HttpStatusCode.NotFound, "Stock does not exist");
            }

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SubscriptionExists(user_id, stock_id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
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

        public bool UserIDHeaderExists(HttpRequestHeaders headers)
        {
            if (headers.Contains(UserIDFieldName))
            {
                return true;
            }
            else return false;
        }

        public string getUserIDFromHeader(HttpRequestHeaders headers)
        {
            string user_id = string.Empty;

            if (headers.Contains(UserIDFieldName))
            {
                user_id = headers.GetValues(UserIDFieldName).First();
            }
            return user_id;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SubscriptionExists(String user_id, int stock_id)
        {
            return db.Subscriptions.Count(e => e.user_id == user_id && e.stock_id == stock_id) > 0;
        }

        private bool StockExists(int stock_id)
        {
            return db.Stocks.Count(e => e.id == stock_id) > 0;
        }
    }
}