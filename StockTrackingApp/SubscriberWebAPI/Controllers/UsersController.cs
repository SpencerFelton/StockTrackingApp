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
        // POST: Users/AddUser
        [Route("users/add-user")]
        [HttpPost]
        public void AddUser([FromBody] User user)
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

        // DELETE: Users/Delete/username
        [Route("users/{username}/delete")]
        [HttpDelete]
        public void DeleteUser(string username)
        {
            User user = UserDBHandler.GetUserByUsername(username);
            if (user == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            UserDBHandler.DeleteUser(username);
        }

        // PUT: Users/Put/username
        [Route("users/{username}/modify")]
        [HttpPut]
        public void ModifyUser([FromBody] User user)
        {
            User userCheck = UserDBHandler.GetUserByUsername(user.username);
            if (user == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            UserDBHandler.ModifyUser(user);
        }

        // GET: Users/Get/username
        [Route("users/{username}")]
        [HttpGet]
        public User GetUserInfo(string username)
        {
            User user = UserDBHandler.GetUserByUsername(username);
            if (user == null) throw new HttpResponseException(HttpStatusCode.NotFound);
            return user;
        }

        // GET: Users
        [Route("users")]
        [HttpGet]
        public IEnumerable<User> GetAllUsers()
        {
            User[] users = UserDBHandler.GetAllUsers();
            return users;     
        }
    }
}
