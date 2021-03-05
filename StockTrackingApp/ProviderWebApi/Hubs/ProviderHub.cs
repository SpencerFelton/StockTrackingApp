using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ProviderWebApi.Models;
using System.Threading.Tasks;

namespace ProviderWebApi.Hubs
{
    public class ProviderHub : Hub
    {
 
        public async Task GetUpdateForStockName(int id, string name)
        {
            Clients.All.addUpdatedStockNamesToPages(id, name);
        }

    }
}