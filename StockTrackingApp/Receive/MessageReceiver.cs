using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using SubscriberWebAPI.Models;
using Newtonsoft.Json.Linq;

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

                // convert back to json
                JObject json = JObject.Parse(message);


                string httpRequestType = json.Value<string>("httpRequestType");

                json.Remove("httpRequestType");

                // handle different kinds of requests here             
                determineAction(httpRequestType, json);
                
            };
            _channel.BasicConsume(queueName, autoAck: true, consumer: consumer);

            return message;
        }

        public void AddToDB(JObject message)
        {
            //De-serialise RMQ message, add fields to array
            //Soon to be replaced by JSON

            TransitStock stock = new TransitStock() //Transit Stock format used within Subscriber API
            {
                stock_id = message.Value<int>("stockID"),
                name = message.Value<string>("stockName"),
                abbreviation = message.Value<string>("stockAbbreviation"),
                price = message.Value<decimal>("stockPrice"),
                dateTime = message.Value<DateTime>("stockDateTime")
            };

            //Calling API methods --- may need to be expanded upon for altering Subscriber side DB if expanded upon i.e deleting history etc
            DBHandler.UpdateStockPrice(stock);
        }

        public void determineAction(string httpRequestType, JObject message)
        {
            if (httpRequestType.Equals("post"))
            {
                AddToDB(message); //API METHOD CALLS FROM RABBITMQ MUST BE CALLED FROM IN HERE
            }
            if (httpRequestType.Equals("get"))
            {

            }
            if (httpRequestType.Equals("post"))
            {

            }
            if (httpRequestType.Equals("post"))
            {

            }
        }
    }
}
