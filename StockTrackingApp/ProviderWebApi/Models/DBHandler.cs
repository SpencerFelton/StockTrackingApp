﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProviderWebApi.Models
{
    /// <summary>
    /// A static class that provides access to CRUD operations with built in verification to the StockTracker database.
    /// </summary>
    public static class DBHandler
    {
        private const int maxStockNameLength = 30;
        private const int maxStockAbbrLength = 4;

        #region DATABASE MODIFIERS
        /// <summary>
        /// Creates a new <see cref="Stock"/> in the StockTracker database, then adds a new <see cref="PriceHistory"/> entry to ensure the stock has price data.
        /// </summary>
        /// <param name="name">The full company name of the stock.</param>
        /// <param name="abbreviation">The shorthand abbreviation of the stock. 4 character limit.</param>
        /// <param name="dateTime">The date and time when the price was accurate to.</param>
        /// <param name="price">The price of the stock at the given date and time, in USD.</param>
        public static void AddStock(string name, string abbreviation)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                if (name.Length > maxStockNameLength) 
                    throw new ArgumentOutOfRangeException($"Name cannot exceed {maxStockNameLength} characters in length");
                if (abbreviation.Length > maxStockAbbrLength) 
                    throw new ArgumentOutOfRangeException($"Abbreviation cannot exceed {maxStockAbbrLength} characters in length");
                
                if (entity.Stocks.Where(s => s.name == name).Count() > 0) 
                    throw new ArgumentException("Stock already exists with the name " + name);
                if (entity.Stocks.Where(s => s.abbr.ToUpper() == abbreviation.ToUpper()).Count() > 0) 
                    throw new ArgumentException("Stock already exists with the abbreviation " + abbreviation);

                Stock stock = new Stock
                {
                    name = name, // name can be however
                    abbr = abbreviation.ToUpper() // abbr should be capitalised
                };

                entity.Stocks.Add(stock);
                entity.SaveChanges();
            }
        }

        /// <summary>
        /// Deletes a <see cref="Stock"/> and all its <see cref="PriceHistory"/> data from the StockTracker database.
        /// </summary>
        /// <param name="abbreviation">The abbreviation of the stock to be deleted.</param>
        public static void DeleteStock(int id)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                if (entity.Stocks.Where(s => s.id == id).Count() == 1)
                {
                    Stock stock = entity.Stocks.Single(s => s.id == id);
                    foreach (PriceHistory price in stock.PriceHistories)
                    {
                        entity.PriceHistories.Remove(price);
                    }
                    entity.Stocks.Remove(stock);
                    entity.SaveChanges();
                }
                else
                {
                    throw new ArgumentException("Stock not found");
                }
            }
        }

        /// <summary>
        /// Creates a new <see cref="PriceHistory"/> entry for a specified stock.
        /// </summary>
        /// <param name="transitStock">The <see cref="TransitStock"/> containing the abbreviation of the stock, the price and the associated date and time.</param>
        public static void UpdateStockPrice(PriceHistory priceHistory)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                if (entity.Stocks.Where(s => s.id == priceHistory.stock_id).Count() == 1)
                {
                    Stock stock = entity.Stocks.Single(s => s.id == priceHistory.stock_id);
                    entity.PriceHistories.Add(priceHistory);
                }
                else
                {
                    throw new ArgumentException("Stock not found");
                }

                entity.SaveChanges();
            }
        }

        public static void ModifyStock(Stock modifiedStock)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                if (entity.Stocks.Where(s => s.id == modifiedStock.id).Count() == 1)
                {
                    Stock stock = entity.Stocks.Single(s => s.id == modifiedStock.id);
                    stock.abbr = modifiedStock.abbr;
                    stock.name = modifiedStock.name;
                }
                else
                {
                    throw new ArgumentException("Stock not found");
                }

                entity.SaveChanges();
            }
        }
        #endregion

        #region TESTER SUPPLEMENTS
        /// <summary>
        /// Counts all the stocks in the Stocks table.
        /// </summary>
        /// <returns>The count/number</returns>
        public static int StockCount()
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                return entity.Stocks.Count();
            }
        }

        /// <summary>
        /// Checks if a stock exists in the database with the same parameters as those provided.
        /// </summary>
        /// <param name="name">The name of the stock.</param>
        /// <param name="abbreviation">The abbreviation of the stock.</param>
        /// <returns>An integer stating what whether no stock was found (0), a stock with the same abbreviation was found(1), a stock with the same name was found (2) or both (3).</returns>
        /// <remarks>
        /// Cannot distinguish between multiple stocks sharing the same name. Cannot distinguish between multiple stocks sharing the same abbreviation.
        /// A return of 3 could mean the there was one stock with the given name and another stock with the given abbreviation OR one stock with both.
        /// </remarks>
        public static int CheckStockExists(string name, string abbreviation)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                int status = 0;
                if (entity.Stocks.Where(s => s.name.ToLower() == name.ToLower()).Count() > 0) status += 2;
                if (entity.Stocks.Where(s => s.abbr.ToUpper() == abbreviation.ToUpper()).Count() > 0) status += 1;
                return status;
            }
        }
        #endregion

        #region GETTERS - OBJECT(s) OR NULL(s) RETURNED WITH 1 EXCEPTION
        /// <summary>
        /// Reads all the <see cref="Stock"/>s from the Stocks table.
        /// </summary>
        /// <returns>An <see cref="Array{Stock}"/> containing all the <see cref="Stock"/>s in the Stocks table.</returns>
        public static Stock[] GetStocks()
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                return entity.Stocks.ToArray();
            }
        }

        /// <summary>
        /// Reads a particular <see cref="Stock"/> from the Stocks table.
        /// </summary>
        /// <param name="id">The id of the stock to be found.</param>
        /// <returns>The particular <see cref="Stock"/> if it exists, otherwise null.</returns>
        public static Stock GetStock(int id)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                return entity.Stocks.SingleOrDefault(s => s.id == id);
            }
        }
        /// <summary>
        /// Reads a particular <see cref="Stock"/> from the Stocks table.
        /// </summary>
        /// <param name="abbreviation">The abbreviation of the stock to be found.</param>
        /// <returns>The particular <see cref="Stock"/> if it exists, otherwise null.</returns>
        public static Stock GetStock(string abbreviation)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                return entity.Stocks.SingleOrDefault(s => s.abbr == abbreviation);
            }
        }

        /// <summary>
        /// Reads a particular <see cref="Stock"/> from the Stocks table from the name.
        /// </summary>
        /// <param name="name">The name of the stock to be found.</param>
        /// <returns>The particular <see cref="Stock"/> if it exists, otherwise null.</returns>
        public static Stock GetStockFromName(string name)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                return entity.Stocks.SingleOrDefault(s => s.name == name);
            }
        }

        /// <summary>
        /// Reads the most recent <see cref="PriceHistory"/> of a <see cref="Stock"/>.
        /// </summary>
        /// <param name="stock">The stock whom's latest price is to be found.</param>
        /// <returns>The price of the <see cref="Stock"/> with the latest associated date and time.</returns>
        /// <exception cref="ArgumentNullException"/>
        /// <exception cref="ArgumentOutOfRangeException"/>
        public static decimal GetMostRecentStockPrice(Stock stock) // Throws exceptions // May be problematic if implemented
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                if (stock == null) throw new ArgumentNullException();
                Stock foundStock = entity.Stocks.SingleOrDefault(s => s.id == stock.id);
                if (foundStock == null) throw new ArgumentOutOfRangeException();
                decimal price = 0.00M;
                DateTime dateTime = stock.PriceHistories.FirstOrDefault().time;
                bool first = true;
                foreach (PriceHistory priceHistory in foundStock.PriceHistories)
                {
                    if (first)
                    {
                        price = priceHistory.value;
                        dateTime = priceHistory.time;
                        first = false;
                    }
                    else
                    {
                        if (DateTime.Compare(priceHistory.time, dateTime) == 1)
                        {
                            dateTime = priceHistory.time;
                            price = priceHistory.value;
                        }
                    }
                }
                return price;
            }
        }

        /// <summary>
        /// Reads the most recent <see cref="PriceHistory"/> entry of a <see cref="Stock"/>.
        /// </summary>
        /// <param name="stock">The stock whom's latest price is to be found.</param>
        /// <returns>The <see cref="PriceHistory"/> of the <see cref="Stock"/> if exists, or null.</returns>
        public static PriceHistory GetMostRecentStockPriceHistory(Stock stock)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                if (stock == null) return null;
                Stock foundStock = entity.Stocks.SingleOrDefault(s => s.id == stock.id);
                if (foundStock == null) return null;
                PriceHistory latestPriceHistory = null;
                bool first = true;
                foreach (PriceHistory priceHistory in foundStock.PriceHistories)
                {
                    if (first)
                    {
                        latestPriceHistory = priceHistory;
                        first = false;
                    }
                    else
                    {
                        if (DateTime.Compare(priceHistory.time, latestPriceHistory.time) == 1)
                        {
                            latestPriceHistory = priceHistory;
                        }
                    }
                }
                return latestPriceHistory;
            }
        }

        /// <summary>
        /// Reads all the <see cref="PriceHistory"/>s in the PriceHistory table.
        /// </summary>
        /// <returns>An <see cref="Array"/> containing all the <see cref="PriceHistory"/>s in the PriceHistory table.</returns>
        public static PriceHistory[] GetPriceHistories()
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                return entity.PriceHistories.ToArray();
            }
        }
        /// <summary>
        /// Reads all the price histories in the PriceHistory table for a particular stock.
        /// </summary>
        /// <param name="stock">The stock whom's priceHistories are to be found.</param>
        /// <returns>An <see cref="Array"/> containing all the <see cref="PriceHistory"/>s if the <see cref="Stock"/> exists, otherwise an empty array.</returns>
        public static PriceHistory[] GetPriceHistories(Stock stock)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                if (stock == null) return new PriceHistory[] { };
                Stock foundStock = entity.Stocks.SingleOrDefault(s => s.id == stock.id);
                if (stock == null) return new PriceHistory[] { };
                return foundStock.PriceHistories.ToArray();
            }
        }

        /// <summary>
        /// Reads a particular entry from the PriceHistory table by the id of the entry.
        /// </summary>
        /// <param name="id">The id of the price history.</param>
        /// <returns>The <see cref="PriceHistory"/> if exists, otherwise null.</returns>
        public static PriceHistory GetPriceHistory(int id)
        {
            using (StockTrackerEntities entity = new StockTrackerEntities())
            {
                return entity.PriceHistories.SingleOrDefault(p => p.id == id);
            }
        }
        #endregion
    }
}