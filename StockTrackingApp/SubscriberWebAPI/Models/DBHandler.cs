﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SubscriberWebAPI.Models
{
    public class DBHandler
    {
        private const int maxStockNameLength = 30;
        private const int maxStockAbbrLength = 4;

        #region DATABASE MODIFIERS
        public static void AddStock(string name, string abbreviation)
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                if (name.Length > maxStockNameLength)
                    throw new ArgumentOutOfRangeException($"Name cannot exceed {maxStockNameLength} characters in length");
                if (abbreviation.Length > maxStockAbbrLength)
                    throw new ArgumentOutOfRangeException($"Name cannot exceed {maxStockNameLength} characters in length");

                if (entity.Stocks.Where(s => s.name.ToLower() == name.ToLower()).Count() > 0)
                    throw new ArgumentException("Stock already exists with the name " + name);
                if (entity.Stocks.Where(s => s.abbr.ToUpper() == abbreviation.ToUpper()).Count() > 0)
                    throw new ArgumentException("Stock already exists with the abbreviation " + abbreviation);

                // No exception thrown => Can create new stock
                // Any exception thown after this will be a system error
                Stock newStock = new Stock
                {
                    name = name, // name can be however
                    abbr = abbreviation.ToUpper() // abbr should be capitalised
                };
                entity.Stocks.Add(newStock);
                entity.SaveChanges();
            }
        }
        public static void AddStock(TransitStock transitStock)
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                if (transitStock.name.Length > maxStockNameLength)
                    throw new ArgumentOutOfRangeException($"Name cannot exceed {maxStockNameLength} characters in length");
                if (transitStock.abbreviation.Length > maxStockAbbrLength)
                    throw new ArgumentOutOfRangeException($"Abbreviation cannot exceed {maxStockNameLength} characters in length");

                if (entity.Stocks.Where(s => s.name.ToLower() == transitStock.name.ToLower()).Count() > 0)
                    throw new ArgumentException("Stock already exists with the name " + transitStock.name);
                if (entity.Stocks.Where(s => s.abbr.ToUpper() == transitStock.abbreviation.ToUpper()).Count() > 0)
                    throw new ArgumentException("Stock already exists with the abbreviation " + transitStock.abbreviation);

                // No exception thrown => Can create new stock
                // Any exception thown after this will be a system error
                Stock newStock = transitStock.ToStock();
                entity.Stocks.Add(newStock);
                entity.SaveChanges();
                PriceHistory priceHistory = transitStock.ToPriceHistory();
                entity.PriceHistories.Add(priceHistory);
                entity.SaveChanges();
            }
        }

        public static void DeleteStock(string abbreviation)
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                if (entity.Stocks.Where(s => s.abbr.ToUpper() == abbreviation.ToUpper()).Count() == 1)
                {
                    Stock stock = entity.Stocks.Single(s => s.abbr.ToUpper() == abbreviation.ToUpper());
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
        public static void DeleteStock(TransitStock transitStock)
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                if (entity.Stocks.Where(s => s.abbr.ToUpper() == transitStock.abbreviation.ToUpper()).Count() == 1)
                {
                    Stock stock = entity.Stocks.Single(s => s.abbr.ToUpper() == transitStock.abbreviation.ToUpper());
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

        public static void UpdateStockPrice(string abbreviation, DateTime dateTime, decimal price)
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
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
        public static void UpdateStockPrice(TransitStock transitStock)
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                Stock stock = entity.Stocks.Single(s => s.abbr.ToUpper() == transitStock.abbreviation.ToUpper());

                PriceHistory priceHistory = new PriceHistory
                {
                    stock_id = stock.id,
                    time = transitStock.dateTime,
                    value = transitStock.price
                };

                entity.PriceHistories.Add(priceHistory);
                entity.SaveChanges();
            }
        }
        #endregion

        #region TESTER SUPPLEMENTS
        public static int StockCount()
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                return entity.Stocks.Count();
            }
        }

        public static int CheckStockExists(string name, string abbreviation)
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                int status = 0;
                if (entity.Stocks.Where(s => s.name.ToLower() == name.ToLower()).Count() > 0) status += 2;
                if (entity.Stocks.Where(s => s.abbr.ToUpper() == abbreviation.ToUpper()).Count() > 0) status += 1;
                return status;
            }
        }
        #endregion

        #region GETTERS - OBJECT(s) OR NULL(s) RETURNED WITH 1 EXCEPTION
        public static Stock[] GetStocks()
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                return entity.Stocks.ToArray();
            }
        }

        public static Stock GetStock(int id)
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                return entity.Stocks.SingleOrDefault(s => s.id == id);
            }
        }
        public static Stock GetStock(string abbreviation)
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                return entity.Stocks.SingleOrDefault(s => s.abbr == abbreviation);
            }
        }

        public static Stock GetStockFromName(string name)
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                return entity.Stocks.SingleOrDefault(s => s.name == name);
            }
        }

        public static decimal GetMostRecentStockPrice(Stock stock) // Throws exceptions // May be problematic if implemented
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
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

        public static PriceHistory GetMostRecentStockPriceHistory(Stock stock)
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
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

        public static PriceHistory[] GetPriceHistories()
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                return entity.PriceHistories.ToArray();
            }
        }
        public static PriceHistory[] GetPriceHistories(Stock stock)
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                if (stock == null) return new PriceHistory[] { };
                Stock foundStock = entity.Stocks.SingleOrDefault(s => s.id == stock.id);
                if (stock == null) return new PriceHistory[] { };
                return foundStock.PriceHistories.ToArray();
            }
        }

        public static PriceHistory GetPriceHistory(int id)
        {
            using (ClientStockTrackerEntities entity = new ClientStockTrackerEntities())
            {
                return entity.PriceHistories.SingleOrDefault(p => p.id == id);
            }
        }
        #endregion
    }
}