using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace SMSSender
{
    class Program
    {
        static void Main(string[] args)
        {
            string accountSid = "AC497154f8ed22e9115f9d5a895fd185d6";
            string authToken = "bf73ceefff0c088646681bcec2d96edd";
            TwilioClient.Init(accountSid, authToken);

            var toPhoneNumber = new PhoneNumber("+447541277864");
            var fromPhoneNumber = new PhoneNumber("+12015968776");

            var message = MessageResource.Create(
                to: toPhoneNumber,
                from: fromPhoneNumber,
                body: "SMS works!");

            Console.WriteLine(message.Sid);
            Console.ReadLine();
        }
    }
}
