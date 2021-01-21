using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProviderAPI
{
    public class TransitStock
    {
        public int stock_id;
        public string name;
        public string abbreviation;
        public decimal price;
        public DateTime dateTime;

        public TransitStock() { }
        public TransitStock(Stock stock, PriceHistory priceHistory)
        {
            if (stock.id != priceHistory.id) throw new InvalidOperationException("Stock.id did not match PriceHistory.stock_id");

            stock_id = stock.id;
            name = stock.name;
            abbreviation = stock.abbr;
            price = priceHistory.value;
            dateTime = priceHistory.time;
        }
        public TransitStock(Stock stock)
        {
            PriceHistory priceHistory = DBHandler.GetMostRecentStockPriceHistory(stock);
            stock_id = stock.id;
            name = stock.name;
            abbreviation = stock.abbr;
            price = priceHistory.value;
            dateTime = priceHistory.time;
        }
        public TransitStock(PriceHistory priceHistory)
        {
            Stock stock = DBHandler.GetStock(priceHistory.stock_id);
            stock_id = stock.id;
            name = stock.name;
            abbreviation = stock.abbr;
            price = priceHistory.value;
            dateTime = priceHistory.time;
        }

        public Stock ToStock(bool idKnown = false)
        {
            if (idKnown)
            {
                return new Stock
                {
                    id = this.stock_id,
                    name = this.name,
                    abbr = this.abbreviation
                };
            }
            else
            {
                return new Stock
                {
                    name = this.name,
                    abbr = this.abbreviation
                };
            }
        }

        public PriceHistory ToPriceHistory(bool idKnown = false)
        {
            if (idKnown)
            {
                return new PriceHistory
                {
                    stock_id = this.stock_id,
                    time = this.dateTime,
                    value = this.price
                };
            }
            else
            {
                Stock stock = DBHandler.GetStock(this.abbreviation);
                return new PriceHistory
                {
                    stock_id = stock.id,
                    time = this.dateTime,
                    value = this.price
                };
            }
        }
    }
}
