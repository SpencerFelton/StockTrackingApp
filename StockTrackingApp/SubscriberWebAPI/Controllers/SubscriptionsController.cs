using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
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
        [Route("api/subscriptions/{stock_id}")]
        [ResponseType(typeof(Subscription))]
        public async Task<IHttpActionResult> GetUserSubscriptionByStockID(int stock_id)
        {
            string user_id = getUserIDFromAccessToken(this.Request.Headers);

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
            string user_id = getUserIDFromAccessToken(this.Request.Headers);

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
            Debug.WriteLine(stock_id);
            string user_id = getUserIDFromAccessToken(Request.Headers);
            Debug.WriteLine("Posting Subscription");
            
            Debug.WriteLine($"user id null: {user_id == ""}");
            if (user_id == "")
            {
                
                return Content(HttpStatusCode.BadRequest, "No Authorization in request header, required to create subscription");
            }
            Debug.WriteLine($"subscription exists: {SubscriptionExists(user_id, stock_id)}");
            if (SubscriptionExists(user_id, stock_id))
            {
                return Content(HttpStatusCode.BadRequest, "Subscription already exists for this user and stock");
            }

            Subscription sub = new Subscription { stock_id = stock_id, user_id = user_id };
            Debug.WriteLine($"subscription made: {sub}");
            Debug.WriteLine($"is modelstate valid: {ModelState.IsValid}");
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Debug.WriteLine($"does the stock exist: {StockExists(stock_id)}");
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
                Debug.WriteLine("yo!");
            }

            catch (DbUpdateException)
            {
                if (SubscriptionExists(user_id, stock_id))
                {
                    Debug.WriteLine("Hello I am");
                    return Conflict();
                }
                else
                {
                    Debug.WriteLine("Here!");
                    throw;
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Debug.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Debug.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
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

        private bool SubscriptionExists(String user_id, int stock_id)
        {
            return db.Subscriptions.Count(e => e.user_id == user_id && e.stock_id == stock_id) > 0;
        }

        private bool StockExists(int stock_id)
        {
            return db.Stocks.Count(e => e.id == stock_id) > 0;
        }

        private string getUserIDFromAccessToken(HttpRequestHeaders headers)
        {
            if (headers.Contains("Authorization"))
            {
                // Take headers, read authorization field, remove "Bearer " prefix
                var authorizationField = headers.GetValues("Authorization").First();
                var bearerToken = authorizationField.Replace("Bearer ", string.Empty);

                // Read token using handler, read "sub" claim, return user_id
                var tokens = new JwtSecurityTokenHandler().ReadToken(bearerToken) as JwtSecurityToken;

                string user_id = tokens.Claims.First(e => e.Type == "sub").Value;
                Debug.WriteLine(user_id);
                return user_id;
            }
            else return "";
        }
    }
}