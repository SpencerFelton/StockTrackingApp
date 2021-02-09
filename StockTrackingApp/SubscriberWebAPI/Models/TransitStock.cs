using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SubscriberWebAPI.Models
{
    /// <summary>
    /// A class designed to universally transfer data regarding both stocks and stock prices through the API.
    /// Provides methods to construct <see cref="Stock"/> and  <see cref="PriceHistory"/> classes directly from the <see cref="TransitStock"/>.
    /// </summary>
    public class TransitStock
    {
        public int stock_id;
        public string name;
        public string abbreviation;
        public decimal price;
        public DateTime dateTime;

        /// <summary>
        /// Initializes a new instance of the <see cref="TransitStock"/> class.
        /// </summary>
        public TransitStock() { }
        /// <summary>
        /// Initializes a new instance of the <see cref="TransitStock"/> class.
        /// </summary>
        /// <param name="stock">The <see cref="Stock"/> instance with the relevant parameters of the <see cref="TransitStock"/>.</param>
        /// <param name="priceHistory">The <see cref="PriceHistory"/> instance with the relevant parameters of the <see cref="TransitStock"/>.</param>
        public TransitStock(Stock stock, PriceHistory priceHistory)
        {
            if (stock.id != priceHistory.id) throw new InvalidOperationException("Stock.id did not match PriceHistory.stock_id");

            stock_id = stock.id;
            name = stock.name;
            abbreviation = stock.abbr;
            price = priceHistory.value;
            dateTime = priceHistory.time;
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="TransitStock"/> class.
        /// </summary>
        /// <param name="stock">The <see cref="Stock"/> instance with the relevant parameters of the <see cref="TransitStock"/>.</param>
        public TransitStock(Stock stock)
        {
            PriceHistory priceHistory = StockDBHandler.GetMostRecentStockPriceHistory(stock);
            stock_id = stock.id;
            name = stock.name;
            abbreviation = stock.abbr;
            price = priceHistory.value;
            dateTime = priceHistory.time;
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="TransitStock"/> class.
        /// </summary>
        /// <param name="priceHistory">The <see cref="PriceHistory"/> instance with the relevant parameters of the <see cref="TransitStock"/>.</param>
        public TransitStock(PriceHistory priceHistory)
        {
            Stock stock = StockDBHandler.GetStock(priceHistory.stock_id);
            stock_id = stock.id;
            name = stock.name;
            abbreviation = stock.abbr;
            price = priceHistory.value;
            dateTime = priceHistory.time;
        }

        /// <summary>
        /// Constructs a new instance of the <see cref="Stock"/> class with the relevant parameters from this <see cref="TransitStock"/>.
        /// </summary>
        /// <param name="idKnown">An optional parameter to declare whether the <see cref="stock_id"/> is specifically known.</param>
        /// <returns>A new instance of the <see cref="Stock"/> class with the relevant parameters from this <see cref="TransitStock"/>.</returns>
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

        /// <summary>
        /// Constructs a new instance of the <see cref="PriceHistory"/> class with the relevant parameters from this <see cref="TransitStock"/>.
        /// </summary>
        /// <param name="idKnown">An optional parameter to declare whether the <see cref="stock_id"/> is specifically known.</param>
        /// <returns>A new instance of the <see cref="PriceHistory"/> class with the relevant parameters from this <see cref="TransitStock"/>.</returns>
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
                Stock stock = StockDBHandler.GetStock(this.abbreviation);
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
