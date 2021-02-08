using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;

namespace SubscriberWebAPI.Models
{

    public class UserDBHandler
    {
        private const int maxUsernameLength = 16;
        private const int maxEmailLength = 320;
        private const int maxNameLength = 50;
        private const int maxPhoneNoLength = 15;

        public static void AddUser(User user)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                if (IsUserInfoValid(user))
                {
                    entity.Users.Add(user);
                    entity.SaveChanges();
                }
                else
                {
                    //throw exception
                }
            }
        }

        public static void DeleteUser(string username)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                if (entity.Users.Where(s => s.username == username).Count() == 1)
                {
                    User user = entity.Users.Single(s => s.username == username);

                    entity.Users.Remove(user);
                }
                else
                {
                    throw new ArgumentException("Stock not found");
                }

                entity.SaveChanges();
            }
        }

        public static void ModifyUser(User modifiedUser)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                if (!IsUserInfoValid(modifiedUser))
                {
                    //throw exception
                }

                if (entity.Users.Where(s => s.username == modifiedUser.username).Count() == 1)
                {
                    User user = entity.Users.Single(s => s.username == modifiedUser.username);
                    user.email = modifiedUser.email;
                    user.first_name = modifiedUser.first_name;
                    user.surname = modifiedUser.surname;
                    user.DOB = modifiedUser.DOB;
                    user.phone_number = modifiedUser.phone_number;
                }
                else
                    throw new ArgumentException("User not found");

                entity.SaveChanges();
            }
        }

        public static User GetUserByUsername(string username)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                return entity.Users.SingleOrDefault(s => s.username == username);
            }
        }

        

        public static Boolean IsUserInfoValid(User user)
        {
            if (user.username.Length == 0 || user.username.Length > maxUsernameLength)
                return false;
            if (!(new EmailAddressAttribute().IsValid(user.email)))
                return false;
            if (user.first_name.Length > maxNameLength || user.surname.Length > maxNameLength)
                return false;
            if (!DateTime.TryParse(user.DOB.ToString(), out DateTime result))
                return false;
            if (user.phone_number.Length > maxPhoneNoLength)
                return false;

            return true;
        }
    }
}