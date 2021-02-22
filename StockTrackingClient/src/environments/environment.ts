export const environment = {
  production: false,
  auth: {
    domain: "dev-bl7v-w7s.eu.auth0.com",
    clientId : "Txk66g88Utscp8lMVybnZAQP6Q5IcxFM",
    redirectUri: window.location.origin,
    audience: "https://StockTracker.client-api",
  },
  dev: {
    serverUrl: "https://localhost:44326/",
  },
};