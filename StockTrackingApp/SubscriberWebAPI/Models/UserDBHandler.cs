using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SubscriberWebAPI.Models
{

    public class UserDBHandler
    {
        private const int maxUsernameLength = 16;
        private const int maxEmailLength = 320;
        private const int maxNameLength = 50;
        private const int maxPhoneNoLength = 15;

        public static void AddStock(User user)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                if (isUserInfoValid(user))
                {
                    entity.Users.Add(user);
                    entity.SaveChanges();
                }
                else
                {
                    //throw some exception
                }
            }
        }

        public static Boolean isUserInfoValid(User user)
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