using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Common;

namespace ProviderAPI
{
    /// <summary>
    /// A class to be called from the provider front end that will allow communication to the database and to clients on
    /// the receiving end of a RabbitMQ server.
    /// Returning ints can be thought of request status codes
    /// 200 - successful execution
    /// 404 - not found - stock does not exist or price history entry does not exist
    /// 406 - not acceptable - arguments are unacceptable
    /// 409 - conflict - stock entry exists
    /// 500 - internal server error - the program threw some other error likely related to the database or RabbitMQ server
    /// </summary>
    public static class APIRouter
    {
        public static int AddStock(string name, string abbreviation)
        {
            try
            {
                DBHandler.AddStock(name, abbreviation);
                System.Diagnostics.Debug.WriteLine($"Stock added: {name} - {abbreviation}");
                return 200;
            }
            catch (ArgumentOutOfRangeException e)
            {
                System.Diagnostics.Debug.WriteLine(e.Message);
                return 406;
            }
            catch (ArgumentException e)
            {
                System.Diagnostics.Debug.WriteLine(e.Message);
                return 409;
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine(e.Message);
                return 500;
            }
        }
        public static int DeleteStock(string abbreviation)
        {
            try
            {
                DBHandler.DeleteStock(abbreviation);
                System.Diagnostics.Debug.WriteLine($"Stock deleted: {abbreviation}");
                return 200;
            }
            catch (ArgumentException e)
            {
                System.Diagnostics.Debug.WriteLine(e.Message);
                return 404;
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine(e.Message);
                return 500;
            }
        }
        public static int UpdateStockPrice(string abbreviation, DateTime dateTime, decimal price)
        {
            try
            {
                DBHandler.UpdateStockPrice(abbreviation, dateTime, price);
                System.Diagnostics.Debug.WriteLine($"Price listed for {abbreviation}: {price} at {dateTime}");
                RabbitMQHandler.SendStockPrice(abbreviation, dateTime, price);
                System.Diagnostics.Debug.WriteLine($"Price sent to RabbitMQ for {abbreviation}: {price} at {dateTime}");
                return 200;
            }
            catch (ArgumentNullException e)
            {
                System.Diagnostics.Debug.WriteLine(e.Message);
                return 404;
            }
            catch (InvalidOperationException e)
            {
                System.Diagnostics.Debug.WriteLine(e.Message);
                return 500;
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine(e.Message);
                return 500;
            }
        }
    }
}
