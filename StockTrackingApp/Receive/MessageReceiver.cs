using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Receive
{
    class MessageReceiver
    {
        private readonly IModel _channel;
        private string queueName = "";
        
        public MessageReceiver(IModel channel)
        {
            _channel = channel;
        }

        public void BindQueue(string queueName)
        {
            _channel.QueueDeclare(queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);
            _channel.QueueBind(queueName, "stocks", "");
        }

        public string ReadMessage(EventingBasicConsumer consumer)
        {
            string message = "";
            consumer.Received += (model, ea) =>
            {
                var body = ea.Body.ToArray();
                message = Encoding.UTF8.GetString(body);
                Console.WriteLine("Received: {0}", message);
            };
            _channel.BasicConsume(queueName, autoAck: true, consumer: consumer);
            return message;
        }


    }
}
