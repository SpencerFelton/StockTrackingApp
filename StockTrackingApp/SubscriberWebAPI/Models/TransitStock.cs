using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SubscriberWebAPI.Models
{
    public class TransitStock
    {
        public int stock_id;
        public string name;
        public string abbreviation;
        public List<PriceHistory> priceHistories;

        private ClientStockTrackerEntities db = new ClientStockTrackerEntities();

        public TransitStock(Stock stock)
        {
            stock_id = stock.id;
            name = stock.name;
            abbreviation = stock.abbr;
            priceHistories = db.PriceHistories.Where(e => e.stock_id == stock.id).ToList();
        }
    }
}