using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProviderAPI
{
    public static class DBHandler
    {
        private const int maxStockNameLength = 30;
        private const int maxStockAbbrLength = 4;

        public static void AddStock(string name, string abbreviation)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                var Stocks = entity.Stocks;

                if (name.Length > maxStockNameLength)
                {
                    throw new Exception($"Name cannot exceed {maxStockNameLength} characters in length");
                }

                if (abbreviation.Length > maxStockAbbrLength)
                {
                    throw new Exception($"Abbreviation cannot exceed {maxStockAbbrLength} characters in length");
                }

                IQueryable<Stock> existingStocks = Stocks.Where(s => s.name.ToLower() == name.ToLower());
                if (existingStocks.Count() > 0)
                {
                    throw new Exception("Stock already exists with the name " + name);
                }

                existingStocks = Stocks.Where(s => s.abbr.ToUpper() == abbreviation.ToUpper());
                if (existingStocks.Count() > 0)
                {
                    throw new Exception("Stock already exists with the abbreviation " + abbreviation);
                }

                // No exception thrown => Can create new stock

                Stock newStock = new Stock
                {
                    name = name, // name can be however
                    abbr = abbreviation.ToUpper() // abbr should be capitalised
                };

                entity.Stocks.Add(newStock);
                entity.SaveChanges();
            }
        }

        public static void DeleteStock(string str)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                // attempt to locate stock where str is an abbreviation
                if (entity.Stocks.Where(s => s.abbr.ToUpper() == str.ToUpper()).Count() == 1)
                {
                    entity.Stocks.Remove(entity.Stocks.Single(s => s.abbr.ToUpper() == str.ToUpper()));
                    entity.SaveChanges();
                }
                // attempt to locate stock where str is a name
                else if (entity.Stocks.Where(s => s.name.ToLower() == str.ToLower()).Count() == 1)
                {
                    entity.Stocks.Remove(entity.Stocks.Single(s => s.name.ToLower() == str.ToLower()));
                    entity.SaveChanges();
                }
                else
                {
                    throw new Exception("Stock not found");
                }
            }
        }

        public static void UpdateStockPrice(string abbreviation, DateTime dateTime, decimal price)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                Stock stock = entity.Stocks.Single(s => s.abbr.ToUpper() == abbreviation.ToUpper());

                PriceHistory priceHistory = new PriceHistory
                {
                    stock_id = stock.id,
                    time = dateTime,
                    value = price
                };

                entity.PriceHistories.Add(priceHistory);
                entity.SaveChanges();
            }
        }
    }
}
