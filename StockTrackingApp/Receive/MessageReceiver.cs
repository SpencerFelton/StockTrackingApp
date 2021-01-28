using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using SubscriberWebAPI.Models;

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
                AddToDB(message);
            };
            _channel.BasicConsume(queueName, autoAck: true, consumer: consumer);
            
            //if (message.Length == 0)
            //{
                //System.Diagnostics.Debug.Write("no message");
               // return message;
            //}
            return message;
        }

        public void AddToDB(string message)
        {
            string[] fieldsList = message.Split(',');
            System.Diagnostics.Debug.Write(fieldsList.ToString());

            TransitStock stock = new TransitStock()
            {
                stock_id = int.Parse(fieldsList[0]),
                name = fieldsList[1],
                abbreviation = fieldsList[2],
                price = decimal.Parse(fieldsList[3]),
                dateTime = DateTime.Parse(fieldsList[4])
            };

            Console.WriteLine(stock.ToString());
            DBHandler.UpdateStockPrice(stock);
        }
    }
}
