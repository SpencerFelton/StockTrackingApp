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

        public static void SendMessage(JObject json)
        {
            var factory = MakeConnectionFactory();

            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare("stocks", ExchangeType.Direct); // Declare exchange "stock"
                MessageSender messageSender = new MessageSender(channel);
                messageSender.BindQueue("stock"); // Declare and Bind Queue "stock" to "stocks" exchange

                string message = json.ToString();

                messageSender.SendMessage(message);
            }
        }

        public static void createAddNewStockRMQMessage(Stock stock)
        {
            JObject json = new JObject();
            json.Add("methodName", "addNewStock");
            json.Add("stockName", stock.name.Trim());
            json.Add("stockAbbreviation", stock.abbr);

            SendMessage(json);
        }
        public static void createModifyStockRMQMessage(Stock stock)
        {
            JObject json = new JObject();
            json.Add("methodName", "changeNameAbbr");
            json.Add("stockID", stock.id);
            json.Add("stockName", stock.name.Trim());
            json.Add("stockAbbreviation", stock.abbr);

            SendMessage(json);
        }
        public static void createDeleteStockRMQMessage(Stock stock)
        {
            JObject json = new JObject();
            json.Add("methodName", "deleteStock");
            json.Add("stockID", stock.id);

            SendMessage(json);
        }
        public static void createUpdateStockPriceRMQMessage(PriceHistory price)
        {
            JObject json = new JObject();
            json.Add("methodName", "changePrice");
            json.Add("stockID", price.stock_id);
            json.Add("stockPrice", price.value);
            json.Add("stockDateTime", price.time);

            SendMessage(json);
        }
    }
}
