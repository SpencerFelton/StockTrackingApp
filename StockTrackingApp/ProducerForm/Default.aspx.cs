using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Producer;
using System.Threading.Tasks;


namespace ProducerForm
{
    public partial class _Default : Page
    {
        static ProducerAPICaller2 prod = new ProducerAPICaller2();

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void UpdateStockButton_Click(object sender, EventArgs e)
        {
            string value = updateStockTextbox.Text;
            Task.Run(() => SendAPIRequest(prod, value));

            // Test connection
            //string test = Task.Run(() => CheckConn(prod)).Result;
            //Response.Write(test);
        }

        static async Task SendAPIRequest(ProducerAPICaller2 prod, string val)
        {
            await prod.SendStockValue(val);
        }

        static async Task<string> CheckConn(ProducerAPICaller2 prod)
        {
            return await prod.TestConn();
        }
    }
}