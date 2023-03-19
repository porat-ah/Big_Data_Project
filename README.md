<p align="center">
  <img src="./images/big data logo.png" width="400"/>
</p>

<h1 align="center">Big Data Final Project</h1>

- [goal](#goal)
- [architecture](#architecture)
- [Installation](#installation)
- [sturcture](#poject-structure)
- [services](#services)
<br/><br/>

## Goal

To study and simulate data pipeline using various DB
<br/><br/>

## Architecture

This project follows Lambda Architecture
<p align="center">
<img src= "./images/lambda_architecture.png" />
</p>
<br/><br/>

## Installation

You can use any part of the project independently.

To install a part, go to the part directory and follow the instructions.
<br/><br/>

## Poject Structure

### app
---
the front end of the application.

In this directory you can find the code for the HTML pages

#### app/dashboard
MVC that creates the dashboard with connection to the REDIS DB

#### app/association
MVC that creates an association rule model using instructions given by the user

![_](Association example.gif)

#### app/search
MVC that handles a search engine for the user 

![_](Search example.gif)

### bigML
---
connector from mongoDB to bigML 

### mongoDB
---
connector from kafka to mongoDB

### redis 
---
connector from kafka to redis 

### Pizza_Simulator
---
The simulator that generates the orders data.
<br/><br/>

## Services

[<img src="https://www.cloudkarafka.com/img/logo.png" width="200"/>](https://www.cloudkarafka.com/)

[<img src="https://webimages.mongodb.com/_com_assets/cms/kuyjf3vea2hg34taa-horizontal_default_slate_blue.svg?auto=format%252Ccompress" width="200"/>](https://www.mongodb.com/atlas)

[<img src="https://static.bigml.com/static/img/bigml.png" width="150"/>](https://bigml.com/)


