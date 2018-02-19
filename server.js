'use strict'
var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser =  require('body-parser');
var path =  require('path');
var app = express();
var request = require('request');
var parser = require('xml2json');
var moment = require('moment');
var momentz = require('moment-timezone');
app.listen(8081,function(){
    console.log('Server started on port 3000');
});
//MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')))

app.get('/price',function(req,res){
   var response;
   console.log("Request Received");
    console.log(req.query);
    console.log(req.query.symbol);
    var symbol = req.query.symbol;
    var priceResponse = {};
    var fullResponse = {};
        request("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+symbol+"&outputsize=full&apikey=3VBM8829UR75KK8Y",function(error,response,body){
       if(!error&&response.statusCode==200){
           priceResponse = JSON.parse(body);
           var currentDate = Object.keys(priceResponse["Time Series (Daily)"])[0];
           var prevDate = Object.keys(priceResponse["Time Series (Daily)"])[1];
           var pricet = {};
           pricet.symbol = priceResponse["Meta Data"]["2. Symbol"];
           pricet.close = priceResponse['Time Series (Daily)'][currentDate]['4. close'];
           pricet.open = priceResponse['Time Series (Daily)'][currentDate]['1. open'];
           pricet.prevClose = priceResponse['Time Series (Daily)'][prevDate]['4. close'];
           var changet = priceResponse['Time Series (Daily)'][currentDate]['4. close']-priceResponse['Time Series (Daily)'][prevDate]['4. close'];
           pricet.change = Number(changet.toFixed(2));
           var percentChange = changet/priceResponse['Time Series (Daily)'][prevDate]['4. close']*100;
           pricet.percent = Number(percentChange.toFixed(2));
           pricet.range = Number(priceResponse['Time Series (Daily)'][currentDate]['3. low']).toFixed(2)+"-"+Number(priceResponse['Time Series (Daily)'][currentDate]['2. high']).toFixed(2);
           pricet.volume = (priceResponse['Time Series (Daily)'][currentDate]['5. volume']).toLocaleString();
           var currentZone = momentz.tz(currentDate,"America/New_York").format('z');
           var currentTime = momentz.tz("America/New_York").format("HH:mm:ss");
           var currentHour = momentz.tz("America/New_York").format("HH");
           var todayDate = momentz.tz("America/New_York").format("YYYY-MM-DD");
           if(todayDate==currentDate){
               if(Number(currentHour)>9&&Number(currentHour)<16){
                   pricet.timestamp = currentDate+" "+currentTime+" "+currentZone;
                   
               }else{
                   pricet.timestamp = currentDate+" 16:00:00 "+currentZone;
               }
           }else{
                   pricet.timestamp = currentDate+" 16:00:00 "+currentZone;
           }
           console.log(pricet.timestamp);
           fullResponse.price  = pricet;
           fullResponse.priceSeries = priceResponse['Time Series (Daily)'];
           var response = JSON.stringify(fullResponse);
           res.json(response);
       }
   });
});

app.get('/sma',function(req,res){
   var symbol = req.query.symbol;
   var smaResponse;
    var fullResponse = {};
    console.log(symbol);
   request("https://www.alphavantage.co/query?function=SMA&symbol="+symbol+"&interval=daily&time_period=10&series_type=open&apikey=3VBM8829UR75KK8Y",function(error,response,body){
               if(!error&&response.statusCode==200){
                   console.log(body);
                   smaResponse = JSON.parse(body);
                   fullResponse.sma  = smaResponse;
                   var response = JSON.stringify(fullResponse);
                   res.json(response);
       }
   });
});

app.get('/ema',function(req,res){
   var symbol = req.query.symbol;
   var emaResponse;
    var fullResponse = {};
   request("https://www.alphavantage.co/query?function=EMA&symbol="+symbol+"&interval=daily&time_period=10&series_type=open&apikey=3VBM8829UR75KK8Y",function(error,response,body){
                     if(!error&&response.statusCode==200){
                           emaResponse = JSON.parse(body);
                           fullResponse.ema  = emaResponse;
                           var response = JSON.stringify(fullResponse);
                           res.json(response);
       }
   });
});

app.get('/stoch',function(req,res){
   var symbol = req.query.symbol;
   var stochResponse;
    var fullResponse = {};
   request("https://www.alphavantage.co/query?function=STOCH&symbol="+symbol+"&interval=daily&time_period=10&slowdmatype=1&slowkmatype=1&series_type=open&apikey=3VBM8829UR75KK8Y",function(error,response,body){
                        if(!error&&response.statusCode==200){
                            stochResponse = JSON.parse(body);
                            fullResponse.stoch  = stochResponse;
                            var response = JSON.stringify(fullResponse);
                            res.json(response);
       }
   });
});

app.get('/adx',function(req,res){
    var symbol = req.query.symbol;
   var adxResponse;
    var fullResponse = {};
   request("https://www.alphavantage.co/query?function=ADX&symbol="+symbol+"&interval=daily&time_period=10&series_type=open&apikey=3VBM8829UR75KK8Y",function(error,response,body){
                    if(!error&&response.statusCode==200){
                           adxResponse = JSON.parse(body);
                           fullResponse.adx  = adxResponse;
                           var response = JSON.stringify(fullResponse);
                           res.json(response);
       }
   });
});

app.get('/rsi',function(req,res){
    var symbol = req.query.symbol;
   var rsiResponse;
    var fullResponse = {};
   request("https://www.alphavantage.co/query?function=RSI&symbol="+symbol+"&interval=daily&time_period=10&series_type=open&apikey=3VBM8829UR75KK8Y",function(error,response,body){
                    if(!error&&response.statusCode==200){
                           rsiResponse = JSON.parse(body);
                           fullResponse.rsi  = rsiResponse;
                           var response = JSON.stringify(fullResponse);
                           res.json(response);
       }
   });
});


app.get('/cci',function(req,res){
    var symbol = req.query.symbol;
   var cciResponse;
    var fullResponse = {};
   request("https://www.alphavantage.co/query?function=CCI&symbol="+symbol+"&interval=daily&time_period=10&series_type=open&apikey=3VBM8829UR75KK8Y",function(error,response,body){
                       if(!error&&response.statusCode==200){
                           cciResponse = JSON.parse(body);
                           fullResponse.cci  = cciResponse;
                           var response = JSON.stringify(fullResponse);
                           res.json(response);
       }
   });
});

app.get('/bbands',function(req,res){
    var symbol = req.query.symbol;
   var bbandsResponse;
    var fullResponse = {};
   request("https://www.alphavantage.co/query?function=BBANDS&symbol="+symbol+"&nbdevup=3&nbdevdn=3&time_period=5&series_type=close&interval=daily&time_period=10&series_type=open&apikey=3VBM8829UR75KK8Y",function(error,response,body){
                       if(!error&&response.statusCode==200){
                           bbandsResponse = JSON.parse(body);
                           fullResponse.bbands  = bbandsResponse;
                           var response = JSON.stringify(fullResponse);
                           res.json(response);
       }
   });
});


app.get('/macd',function(req,res){
    var symbol = req.query.symbol;
   var macdResponse;
    var fullResponse = {};
   request("https://www.alphavantage.co/query?function=MACD&symbol="+symbol+"&interval=daily&time_period=10&series_type=open&apikey=3VBM8829UR75KK8Y",function(error,response,body){
                       if(!error&&response.statusCode==200){
                           macdResponse = JSON.parse(body);
                           fullResponse.macd  = macdResponse;
                           var response = JSON.stringify(fullResponse);
                           res.json(response);
       }
   });
});

app.get('/news',function(req,res){
    var symbol = req.query.symbol;
   var newsResponse;
    var fullResponse = {};
   request("https://seekingalpha.com/api/sa/combined/"+symbol+".xml",function(error,response,body){
       if(!error&&response.statusCode==200){
           newsResponse = JSON.parse(parser.toJson(body));
           var iterator = 0;
           var newsArray = [];
           var count = 0;
            for(iterator = 0;iterator<newsResponse.rss.channel.item.length;iterator++){
                if(newsResponse.rss.channel.item[iterator].link == "https://seekingalpha.com/symbol/"+symbol+"/news?source=feed_symbol_"+symbol+""){
                    continue;
                }else{
                    var itemArray = {};
                    itemArray.title= newsResponse.rss.channel.item[iterator].title;
                    itemArray.link = newsResponse.rss.channel.item[iterator].link;
                    itemArray.pub_date = newsResponse.rss.channel.item[iterator].pubDate;
                    itemArray.author = newsResponse.rss.channel.item[iterator]["sa:author_name"];
                    newsArray[count] = itemArray;
                    count++;
                    if(count==5){
                        break;
                    }
                }
            }
           fullResponse.news  = newsArray;
           var response = JSON.stringify(fullResponse);
           res.json(response);
       }
   });
});


app.get('/auto',function(req,res){
   var response;
   request('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input='+req.query.symbol,function(error,response,body){
       if(!error&&response.statusCode==200){
           res.json(body);
       }
   });
});

app.get('/refresh',function(req,res){
   var response;
    var priceResponseArray = [];
    var fullResponse = {};
    var i,iterator=1;
    var list = req.query.symbolList;
    for( i=0;i<list.length;i++){
      var priceResponse = {}; 
          request("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+list[i]+"&apikey=3VBM8829UR75KK8Y",function(error,response,body){
           if(!error&&response.statusCode==200){
               priceResponse = JSON.parse(body);
               var currentDate = Object.keys(priceResponse["Time Series (Daily)"])[0];
               var prevDate = Object.keys(priceResponse["Time Series (Daily)"])[1];
               var pricet = {};
               pricet.symbol = priceResponse["Meta Data"]["2. Symbol"];
               pricet.close = priceResponse['Time Series (Daily)'][currentDate]['4. close'];
               console.log(priceResponse['Time Series (Daily)'][currentDate]['4. close']);
               var changet = priceResponse['Time Series (Daily)'][currentDate]['4. close']-priceResponse['Time Series (Daily)'][prevDate]['4. close'];
               pricet.change = Number(changet.toFixed(2));
               var percentChange = changet/priceResponse['Time Series (Daily)'][prevDate]['4. close']*100;
               pricet.percent = Number(percentChange.toFixed(2));
               pricet.volume = (priceResponse['Time Series (Daily)'][currentDate]['5. volume']).toLocaleString();
               priceResponseArray.push(pricet);
               if(iterator==list.length){
                    var response = JSON.stringify(priceResponseArray);
                    console.log(response);
                    res.json(response);
                }
               iterator++;
               console.log(priceResponseArray);
           }
        });
        
    }
    
});
   
