﻿using System.Linq;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace SubscriberWebApi.Support
{
    public class OpenIdConnectSigningKeyResolver
    {
        private readonly OpenIdConnectConfiguration openIdConfig;

        public OpenIdConnectSigningKeyResolver(string authority)
        {
            var cm = new ConfigurationManager<OpenIdConnectConfiguration>($"{authority.TrimEnd('/')}/.well-known/openid-configuration", new OpenIdConnectConfigurationRetriever());
            openIdConfig = AsyncHelper.RunSync(async () => await cm.GetConfigurationAsync());
        }

        public SecurityKey[] GetSigningKey(string kid)
        {
            return new[] { openIdConfig.JsonWebKeySet.GetSigningKeys().FirstOrDefault(t => t.KeyId == kid) };
        }
    }
}