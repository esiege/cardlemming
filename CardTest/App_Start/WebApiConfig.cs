using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace CardTest
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
			{
				config.Routes.MapHttpRoute(
						name: "DefaultApi",
						routeTemplate: "api/{controller}/{action}/{id}",
						defaults: new { id = RouteParameter.Optional }
				);

				config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
				config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;

				// Remove default XML handler
				var matches = config.Formatters.Where(f => f.SupportedMediaTypes.Count(m => m.MediaType.ToString() == "application/xml" || m.MediaType.ToString() == "text/xml") > 0).ToList();

				foreach (var match in matches)
					config.Formatters.Remove(match);

				config.EnableSystemDiagnosticsTracing();
        }
    }
}
