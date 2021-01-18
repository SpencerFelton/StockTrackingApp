using Microsoft.AspNetCore.Mvc;
using RabbitMQ.Client;
using Send;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProducerAPI.Controllers
{
    [ApiController]
    public class ProducerValueController : ControllerBase
    {
        [HttpPost("api/SendValue/{a}")]
        public void SendValue(string a)
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

                string message = a; // change this to whatever message

                messageSender.SendMessage(message);
            }
        }

        [HttpGet("api")]
        public string TestConnection()
        {
            return "connected";
        }
    }
}
