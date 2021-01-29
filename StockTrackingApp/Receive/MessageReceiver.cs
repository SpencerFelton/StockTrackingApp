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
                AddToDB(message); //API METHOD CALLS FROM RABBITMQ MUST BE CALLED FROM IN HERE
            };
            _channel.BasicConsume(queueName, autoAck: true, consumer: consumer);

            return message;
        }

        public void AddToDB(string message)
        {
            //De-serialise RMQ message, add fields to array
            //Soon to be replaced by JSON
            string[] fieldsList = message.Split(',');

            TransitStock stock = new TransitStock() //Transit Stock format used within Subscriber API
            {
                stock_id = int.Parse(fieldsList[0]),
                name = fieldsList[1],
                abbreviation = fieldsList[2],
                price = decimal.Parse(fieldsList[3]),
                dateTime = DateTime.Parse(fieldsList[4])
            };

            //Calling API methods --- may need to be expanded upon for altering Subscriber side DB if expanded upon i.e deleting history etc
            DBHandler.UpdateStockPrice(stock);
        }
    }
}
