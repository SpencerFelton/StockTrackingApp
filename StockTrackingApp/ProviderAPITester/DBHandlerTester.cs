using ProviderAPI;
using NUnit.Framework;
using System;

namespace ProviderAPITester
{
    [TestFixture]
    public class DBHandlerTester
    {
        #region TEMPERMENTAL TESTS
        [TestCase("Test stock", "TEST")]
        public void TestAddStock_CanAddStock(string name, string abbreviation)
        {
            try
            {
                DBHandler.AddStock(name, abbreviation);
                Assert.IsFalse(DBHandler.CheckStockExists(name, abbreviation) == 0);
            }
            catch (ArgumentException e)
            {
                Assert.IsFalse(DBHandler.CheckStockExists(name, abbreviation) == 0);
                Assert.Inconclusive();
            }
        }
        [TestCase("TEST")]
        public void Test_DeleteStock_CanDeleteStock(string abbreviation)
        {
            try
            {
                DBHandler.DeleteStock(abbreviation);
            }
            catch (ArgumentException e)
            {
                // assert that DeleteStock failed because stock does not exist to give inconclusive result
                Assert.IsFalse(DBHandler.CheckStockExists("", abbreviation) == 1 // abbreviaton does not exist
                    || DBHandler.CheckStockExists("", abbreviation) == 3 // abbreviation with name does not exist
                    );
                Assert.Inconclusive();
            }
            Assert.IsFalse(DBHandler.CheckStockExists("", abbreviation) == 1); // assert abbreviation does not exist
            Assert.IsFalse(DBHandler.CheckStockExists("", abbreviation) == 3); // assert abbreviation does not exist with name also
        }
        #endregion
        #region VALIDATION ASSERTION
        [TestCase("Some long name with 31 letterss", "ZZZZ")]
        public void TestAddStock_EnsuresNameLength(string name, string abbreviation)
        {
            Assert.Throws<ArgumentOutOfRangeException>(delegate { DBHandler.AddStock(name, abbreviation); });
        }
        [TestCase("A suitable name", "ZZZZZ")]
        public void TestAddStock_EnsuresAbbreviationLength(string name, string abbreviation)
        {
            Assert.Throws<ArgumentOutOfRangeException>(delegate { DBHandler.AddStock(name, abbreviation); });
        }
        #endregion
    }
}
