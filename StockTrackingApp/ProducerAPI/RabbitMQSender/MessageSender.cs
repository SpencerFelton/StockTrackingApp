using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Send
{
    class MessageSender
    {
        private readonly IModel _channel;
        private string queueName = "";

        public MessageSender(IModel channel)
        {
            _channel = channel;
        }

        public void BindQueue(string queueName)
        {
            _channel.QueueDeclare(queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);
            _channel.QueueBind(queueName, "stocks", "");
        }

        public void DeclareQueue(string queueName) // declare and bind queue to the exchange
        {
            _channel.QueueDeclare(queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);
            _channel.QueueBind(queueName, "stocks", "");
        }

        public void SendMessage(string message)
        {
            
            var body = Encoding.UTF8.GetBytes(message);
            _channel.BasicPublish(exchange: "stocks", routingKey: "", basicProperties: null, body: body);
            Console.WriteLine("Sent {0}", message);
            
        }
    }
}
