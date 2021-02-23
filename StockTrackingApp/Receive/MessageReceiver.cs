using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Text;
using SubscriberWebAPI.Models;
using SubscriberWebAPI.Controllers;
using Newtonsoft.Json.Linq;
using System.Data.Entity;

namespace Receive
{
    class MessageReceiver
    {
        private readonly IModel _channel;
        private string queueName = "";

        private ClientStockTrackerEntities db = new ClientStockTrackerEntities();

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

                string methodName = json.Value<string>("methodName");
                json.Remove("methodName");

                // handle different kinds of requests here             
                determineAction(methodName, json);
                
            };
            _channel.BasicConsume(queueName, autoAck: true, consumer: consumer);

            return message;
        }

        public void addNewStock(JObject message)
        {
            Stock stock = new Stock()
            {
                name = message.Value<string>("stockName"),
                abbr = message.Value<string>("stockAbbreviation")
            };
            db.Stocks.Add(stock);
            db.SaveChanges();
        }

        public void changeNameAbbr(JObject message)
        {
            Stock stock = new Stock()
            {
                id = message.Value<int>("stockID"),
                name = message.Value<string>("stockName"),
                abbr = message.Value<string>("stockAbbreviation")
            };

            db.Entry(stock).State = EntityState.Modified;
            db.SaveChanges();
        }

        public void deleteStock(JObject message)
        {
            Stock stock = new Stock()
            {
                id = message.Value<int>("stockID")
            };
            db.Stocks.Remove(stock);
            db.SaveChanges();
        }

        public void changePrice(JObject message)
        {
            PriceHistory price = new PriceHistory() //Transit Stock format used within Subscriber API
            {
                stock_id = message.Value<int>("stockID"),
                value = message.Value<decimal>("stockPrice"),
                time = message.Value<DateTime>("stockDateTime")
            };

            //Calling API methods --- may need to be expanded upon for altering Subscriber side DB if expanded upon i.e deleting history etc
            db.PriceHistories.Add(price);
            db.SaveChanges();
        }

        public void determineAction(string methodName, JObject message)
        {
            switch (methodName)
            {
                case "addNewStock":
                    //add new stock to database
                    addNewStock(message);
                    break;
                case "changePrice":
                    // change price of stock in database
                    changePrice(message);
                    break;
                case "changeNameAbbr":
                    // change name or abbreviation of stock in database
                    changeNameAbbr(message);
                    break;
                case "deleteStock":
                    // delete stock by id from database
                    deleteStock(message);
                    break;
            }
        }
    }
}
