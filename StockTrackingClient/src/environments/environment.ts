export const environment = {
  production: false,
  auth: {
    domain: "dev-bl7v-w7s.eu.auth0.com",
    clientId : "Txk66g88Utscp8lMVybnZAQP6Q5IcxFM",
    redirectUri: window.location.origin,
    audience: "https://StockTracker.provider-api",
  },
  dev: {
    serverUrlProvider: "https://localhost:44326",
    serverUrlClient:"https://localhost:44353"
  },
};