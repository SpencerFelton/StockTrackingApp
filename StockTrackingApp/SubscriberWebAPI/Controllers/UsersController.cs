using SubscriberWebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

namespace SubscriberWebAPI.Controllers
{
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]
    public class UsersController : ApiController
    {
        // POST: User/Create
        [HttpPost]
        public void AddUser(User user)
        {
            try
            {
                if (user == null) throw new HttpResponseException(HttpStatusCode.BadRequest);

                //UserDBHandler.AddUser(user);
            }
            catch
            {
                
            }
        }

        // POST: User/Delete/5
        [HttpPost]
        public void Delete(int id)
        {
        }
    }
}
