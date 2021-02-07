# 🚀 Stock Tracking App

![build-test](https://github.com/SpencerFelton/StockTrackingApp/workflows/build-test/badge.svg)

A stock tracking application built using C#, RabbitMQ and Angular. Originally started as our Capita Novus program group project, we continued developing it to finish its intended functionality. 

Created by Spencer Felton, Jack Barlow, Alex Robinson, Joe Waddington, Sinko Mutambo, Dan Greenhalgh, Hanad Salim, Arun George and Adrian Kaczmarczyk.

## Structure

The application is built using the following structure:

![StockTrackingAppStructure](https://user-images.githubusercontent.com/39312505/105208879-19df5280-5b41-11eb-8df7-01c6853fe02b.PNG)

* Message Sender API - represents the service provider (Similarly to e.g. Yahoo Finance API) which tracks stock data. 
* RabbitMQ Server - sends update messages between the sender and receiver API's to sync their data.
* Message Receiver API(s) - acts as the Subscriber API, allowing users to view stock data and subscribe to specific stocks via the StockTrackingClient.
* Presentation components - on the provider side, stocks can be added/deleted, modified and have their price changed. On the subscriber side, users can view stocks and their associated price data, as well as subscribe to particular stocks they are interested in.
