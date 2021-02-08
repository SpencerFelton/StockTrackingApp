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

                UserDBHandler.AddUser(user);
            }
            catch
            {
                
            }
        }

        // DELETE: User/Delete/username
        [HttpDelete]
        public void DeleteUser(string username)
        {
            User user = UserDBHandler.GetUserByUsername(username);
            if (user == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            UserDBHandler.DeleteUser(username);
        }

        // PUT: User/Put/username
        [HttpPut]
        public void ModifyUser(User user)
        {
            User userCheck = UserDBHandler.GetUserByUsername(user.username);
            if (user == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            UserDBHandler.ModifyUser(user);
        }
    }
}
