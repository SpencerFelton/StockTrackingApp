using System;
using System.Collections.Generic;
using System.Linq;

namespace SubscriberWebAPI.Models
{
    public class StockWithPrice
    {
        public int stock_id;
        public string name;
        public string abbreviation;
        public PriceHistory priceHistory;

        private ClientStockTrackerEntities db = new ClientStockTrackerEntities();

        public StockWithPrice(Stock stock, PriceHistory price)
        {
            stock_id = stock.id;
            name = stock.name;
            abbreviation = stock.abbr;
            priceHistory = price;
        }
    }
}