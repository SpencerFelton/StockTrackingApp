using System;
using System.Collections.Generic;
using System.Linq;

namespace SubscriberWebAPI.Models
{
    public class TransitStock
    {
        public int stock_id;
        public string name;
        public string abbreviation;
        public PriceHistory priceHistory;
        public List<PriceHistory> priceHistories;

        private ClientStockTrackerEntities db = new ClientStockTrackerEntities();

        public TransitStock(Stock stock)
        {
            stock_id = stock.id;
            name = stock.name;
            abbreviation = stock.abbr;
            priceHistories = db.PriceHistories.Where(e => e.stock_id == stock.id).ToList();
        }

        public TransitStock(Stock stock, PriceHistory price)
        {
            stock_id = stock.id;
            name = stock.name;
            abbreviation = stock.abbr;
            priceHistory = price;
        }
    }
}