using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RabbitMQ.Client;

namespace RabbitMQSend
{
    class Program
    {
        static void Main(string[] args)
        {
        }

        public static void Send()
        {
            var connectionFactory = new RabbitMQ.Client.ConnectionFactory() // create new conenction factory
            {
                Password = "guest", // default pw
                UserName = "guest", // username
                HostName = "localhost" //host
            };
        }
    }
}
