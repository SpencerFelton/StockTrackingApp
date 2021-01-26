using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;


namespace Receive
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
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare("stocks", ExchangeType.Direct); // Declare exchange "stocks"


                MessageReceiver messageReceiver = new MessageReceiver(channel);
                messageReceiver.BindQueue("stock");

                var consumer = new EventingBasicConsumer(channel);
                string readMessage = messageReceiver.ReadMessage(consumer);
                Console.WriteLine(readMessage);
                Console.WriteLine("Press [enter] to exit");
                Console.ReadLine();
            }  
        }
    }
}
