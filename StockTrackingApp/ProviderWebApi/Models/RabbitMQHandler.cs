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

        public static ConnectionFactory MakeConnectionFactory()
        {
            // Building the connection factory, contains default username, password and localhost
            var factory = new ConnectionFactory()
            {
                UserName = "guest",
                Password = "guest",
                HostName = "localhost"
            };

            return factory;
        }
        public static void SendRabbitMQMessage(TransitStock transitStock, string methodName)
        {
            var factory = MakeConnectionFactory();

            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare("stocks", ExchangeType.Direct); // Declare exchange "stock"
                MessageSender messageSender = new MessageSender(channel);
                messageSender.BindQueue("stock"); // Declare and Bind Queue "stock" to "stocks" exchange
                JObject json = new JObject();

                switch (methodName)
                {
                    case "addNewStock":
                        json.Add("methodName", methodName);
                        json.Add("stockName", transitStock.name.Trim());
                        json.Add("stockAbbreviation", transitStock.abbreviation);
                        break;
                    case "changePrice":
                        json.Add("methodName", methodName);
                        json.Add("stockID", transitStock.stock_id);
                        json.Add("stockPrice", transitStock.price);
                        json.Add("stockDateTime", transitStock.dateTime);
                        break;
                    case "changeNameAbbr":
                        json.Add("methodName", methodName);
                        json.Add("stockID", transitStock.stock_id);
                        json.Add("stockName", transitStock.name.Trim());
                        json.Add("stockAbbreviation", transitStock.abbreviation);
                        break;
                    case "deleteStock":
                        json.Add("methodName", methodName);
                        json.Add("stockID", transitStock.stock_id);
                        break;
                }
                string message = json.ToString();

                messageSender.SendMessage(message);
            }
        }
    }
}
