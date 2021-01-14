using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProviderAPI
{
    public static class APIRouter
    {
        public static void AddStock(string name, string abbreviation)
        {
            DBHandler.AddStock(name, abbreviation);
        }
        public static void DeleteStock(string name)
        {
            DBHandler.DeleteStock(name);
        }
        public static void UpdateStockPrice(string abbreviation, DateTime dateTime, decimal price)
        {
            DBHandler.UpdateStockPrice(abbreviation, dateTime, price);
            RabbitMQHandler.SendStockPrice(abbreviation, dateTime, price);
        }
    }
}
