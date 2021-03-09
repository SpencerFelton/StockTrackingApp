using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http.Results;
using System.Net.Http;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ProviderWebApi.Models;
using ProviderWebApi.Controllers;
using System.Web.Http;

namespace StockTracker
{
    [TestClass]
    public class TestProviderStocksController
    {
        [TestMethod]
        public void GetAllStocks_ShouldReturnAllStocks()
        {
            // Arrange
            var testStocks = GetTestStocks();
            var controller = new StocksController(testStocks);

            // Act
            var result = controller.GetAllStocks() as List<Stock>;

            // Assert
            Assert.AreEqual(testStocks.Count, result.Count);
        }

        [TestMethod]
        public async Task GetAllStocksAsync_ShouldReturnAllStocks()
        {
            // Arrange
            var testStocks = GetTestStocks();
            StocksController controller = new StocksController(testStocks);

            // Act
            var result = await controller.GetAllStocksAsync() as List<Stock>;

            // Assert
            Assert.AreEqual(testStocks.Count, result.Count);
        }

        [TestMethod]
        public async Task GetStock_ShouldReturnCorrectStock()
        {
            // Arrange
            var testStocks = GetTestStocks();
            StocksController controller = new StocksController(testStocks);

            // Act
            IHttpActionResult result = await controller.GetStock(5);
            var resultContent = result as OkNegotiatedContentResult<int>;

            // Assert
            Assert.AreEqual(5, resultContent.Content);
        }

        private List<Stock> GetTestStocks()
        {
            var testStocks = new List<Stock>();
            testStocks.Add(new Stock { id = 1, name = "test stock 1", abbr = "tst1" });
            testStocks.Add(new Stock { id = 2, name = "test stock 2", abbr = "tst2" });
            testStocks.Add(new Stock { id = 3, name = "test stock 3", abbr = "tst3" });
            testStocks.Add(new Stock { id = 4, name = "test stock 4", abbr = "tst4" });
            testStocks.Add(new Stock { id = 5, name = "test stock 5", abbr = "tst5" });

            return testStocks;
        }
    }
}
