using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProviderAPI
{
    public static class RabbitMQHandler
    {
        public static void SendStockPrice(string abbreviation, DateTime dateTime, decimal price)
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

                string message = price.ToString(); // change this to whatever message

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
                string message = $"{transitStock.stock_id},{transitStock.name.Trim()},{transitStock.abbreviation},{transitStock.price},{transitStock.dateTime}";

                messageSender.SendMessage(message);
            }
        }
    }
}
