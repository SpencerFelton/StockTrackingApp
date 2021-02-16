using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Owin;

namespace ProviderWebApi
{
    public static class WebApiConfig
    {
        public static void Configure(IAppBuilder app)
        {
            // Web API configuration and services
            HttpConfiguration config = new HttpConfiguration();

            // Web API routes
            config.MapHttpAttributeRoutes();

            // Enable Cross Origin Requests
            config.EnableCors();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            app.Use(config);
        }
    }
}
