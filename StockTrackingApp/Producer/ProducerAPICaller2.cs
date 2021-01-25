using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Producer
{
    public class ProducerAPICaller2
    {
        private static HttpClient client = new HttpClient();
        private static Uri BaseAddress = new Uri("https://localhost:44399/");

        public ProducerAPICaller2()
        {

        }

        public async Task<string> SendStockValue(string a)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, BaseAddress + $"api/SendValue/{a}");
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<string> TestConn()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, BaseAddress + $"api");
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
    }
}
