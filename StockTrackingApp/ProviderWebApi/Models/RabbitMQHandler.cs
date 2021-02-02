using Newtonsoft.Json.Linq;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProviderWebApi.Models
{
    public static class RabbitMQHandler
    {
        public static void SendStockPrice(int stock_id, string name, string abbreviation, decimal price, DateTime dateTime)
        {
            // Building the connection factory, contains default username, password and localhost
            var factory = new ConnectionFactory()
            {
                UserName = "guest",
                Password = "guest",
                HostName = "localhost"
            };

            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare("stocks", ExchangeType.Direct); // Declare exchange "stock"
                MessageSender messageSender = new MessageSender(channel);
                messageSender.BindQueue("stock"); // Declare and Bind Queue "stock" to "stocks" exchange

                string message = $"{stock_id},{name.Trim()},{abbreviation},{price},{dateTime}";

                messageSender.SendMessage(message);
            }
        }
        public static void SendStockPrice(TransitStock transitStock)
        {
            // Building the connection factory, contains default username, password and localhost
            var factory = new ConnectionFactory()
            {
                UserName = "guest",
                Password = "guest",
                HostName = "localhost"
            };

            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare("stocks", ExchangeType.Direct); // Declare exchange "stock"
                MessageSender messageSender = new MessageSender(channel);
                messageSender.BindQueue("stock"); // Declare and Bind Queue "stock" to "stocks" exchange

                // string message = transitStock.price.ToString(); // change this to whatever message
                JObject json = new JObject();
                json.Add("httpRequestType", "post"); // change the httprequesttype based on the method being called
                json.Add("stockID", transitStock.stock_id);
                json.Add("stockName", transitStock.name.Trim());
                json.Add("stockAbbreviation", transitStock.abbreviation);
                json.Add("stockPrice", transitStock.price);
                json.Add("stockDateTime", transitStock.dateTime);

                string message = json.ToString();

                messageSender.SendMessage(message);
            }
        }
    }
}
