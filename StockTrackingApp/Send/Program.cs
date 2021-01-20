using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RabbitMQ.Client;

namespace Send
{
    class Program
    {
        static void Main(string[] args)
        {
            // Building the connection factory, contains default username, password and localhost
            var factory = new ConnectionFactory()
            {
                UserName = "guest",
                Password = "guest",
                HostName = "localhost"
            };

            using (var connection = factory.CreateConnection())
            using(var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare("stocks", ExchangeType.Direct); // Declare exchange "stock"
                MessageSender messageSender = new MessageSender(channel); 
                messageSender.BindQueue("stock"); // Declare and Bind Queue "stock" to "stocks" exchange

                string message = "hello"; // change this to whatever message

                messageSender.SendMessage(message);
            }
            Console.WriteLine("Press [enter] to exit");
            Console.ReadLine();
        }


            
    }
}
