﻿using System;
using System.Collections.Generic;
using System.Linq;

namespace ProviderWebApi.Models
{
    public class TransitStock
    {
        public int stock_id;
        public string name;
        public string abbreviation;
        public List<PriceHistory> priceHistories;

        private StockModel db = new StockModel();

        public TransitStock(Stock stock)
        {
            stock_id = stock.id;
            name = stock.name;
            abbreviation = stock.abbr;
            priceHistories = db.PriceHistories.Where(e => e.stock_id == stock.id).ToList();
        }

        public TransitStock(Stock stock, List<PriceHistory> prices)
        {
            stock_id = stock.id;
            name = stock.name;
            abbreviation = stock.abbr;
            priceHistories = prices;
        }
    }
}