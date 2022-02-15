var extracts = ['milk', 'egg', 'trf', 'wool', 'hhr', 'ftr', 'fur', 'pow']
var extractsMiningRequirements = {
'milk': 4, 'egg': 8, 'trf': 3, 'wool': 6, 'hhr': 1, 'ftr': 1, 'fur': 2, 'pow': 1
}

est_mining_supply = {
1: 974934,
2: 1949867,
3: 2924801,
4: 3899735,
5: 4874668,
6: 5849601,
7:	6824535,
8:	7799468,
9:	8774402,
10:	9749335,
11:	10686038,
12:	11622739,
13:	12559440,
14:	13496141,
15:	14432842,
16:	15369543,
17:	16306244,
18:	17242945,
19:	18179646,
20:	19116347,
21:	20033931,
22:	20951516,
23:	21869101,
24:	22786686,
25:	23704271,
26:	24621856,
27:	25539441,
28:	26457026,
29:	27374611,
30:	28292196
}

var miningDif
var nextEstDiff
var nextl1
var currentWeek
function getMiningDif(){
  $.ajax({
    url: "https://api.cropbytes.com/api/v1/game/assets/mine_stats",
    context: 'application/json',
    async: false
  }).done(function(data) {
      currentWeek = data.data.week
      miningDif = data.data.difficulty
      nextEstDiff = parseFloat((data.data.totalMine / est_mining_supply[data.data.week]) ** 5).toFixed(2)
      $.each(est_mining_supply, function(i, e){
        calcl1 = parseFloat((data.data.totalMine / est_mining_supply[i]) ** 5)
        if (calcl1 <= 1){
            nextl1 = {'week': parseInt(i) + 1, 'difficulty': calcl1.toFixed(2)}
            return false;
        }
      })
      $('#diffInfoCont').append('<strong>Current Diff: ' + miningDif + ' <span style="margin-left: 10px;">Next Est. Diff: ' + nextEstDiff + '</span>\n<span style="margin-left: 10px;">Next Est. DL &leq; 1: Week ' + nextl1.week + ' (' + nextl1.difficulty + ')' + '</span></strong>')
    });


}

function getMiningVsExchange(extract_id){
    var market_price = getPrice(extract_id).price
    var extract_conversion_rate = extractsMiningRequirements[extract_id]

    var mining_return = extract_conversion_rate * miningDif
    var exchange_return = 1 / market_price
    var next_mining_return = extract_conversion_rate * nextEstDiff
    var est_dl1_price = (exchange_return * market_price) / extract_conversion_rate
    return {'mining_return': mining_return, 'exchange_return': exchange_return, 'next_mining_return': next_mining_return, 'est_dl1_price': est_dl1_price}
}

var wells = ['sw', 'well', 'lake', 'wtw', 'spw']
var wellConfigs = [
{
    assetId: 'sw',
    takes: [],
    gives: [{extractId: 'water', count: 1}],
    extractTime: (2.5/24)
},
{
    assetId: 'well',
    takes: [],
    gives: [{extractId: 'water', count: 1}],
    extractTime: (1/24)
},
{
    assetId: 'lake',
    takes: [],
    gives: [{extractId: 'water', count: 3}],
    extractTime: (2/24)
},
{
    assetId: 'wtw',
    takes: [],
    gives: [{extractId: 'pow', count: 5}],
    extractTime: (4/24)
},
{
    assetId: 'spw',
    takes: [],
    gives: [{extractId: 'pow', count: 1}],
    extractTime: (8/24)
}
]

var cropLands = ['scl', 'ocl', 'fcl']
var cropLandsClone = ['sclcorn', 'oclcorn', 'fclcorn','sclcarrot', 'oclcarrot', 'fclcarrot']
var cropConfigs = {
    carrot: [
        {
        assetId: 'scl',
        takes: [{assetId: 'water', count: 1}, {assetId: 'cas', count: 1}],
        gives: [{extractId: 'caf', count: 3}],
        extractTime: 5
        },
        {
        assetId: 'ocl',
        takes: [{assetId: 'water', count: 1}, {assetId: 'cas', count: 1}],
        gives: [{extractId: 'caf', count: 5}],
        extractTime: 5
        },
        {
        assetId: 'fcl',
        takes: [{assetId: 'water', count: 12}, {assetId: 'cas', count: 12}],
        gives: [{extractId: 'caf', count: 60}],
        extractTime: 5
        },
    ],
    corn: [
        {
        assetId: 'scl',
        takes: [{assetId: 'water', count: 1}, {assetId: 'cos', count: 1}],
        gives: [{extractId: 'cof', count: 6}],
        extractTime: 1.5
        },
        {
        assetId: 'ocl',
        takes: [{assetId: 'water', count: 1}, {assetId: 'cos', count: 1}],
        gives: [{extractId: 'cof', count: 12}],
        extractTime: 1.5
        },
        {
        assetId: 'fcl',
        takes: [{assetId: 'water', count: 12}, {assetId: 'cos', count: 12}],
        gives: [{extractId: 'cof', count: 144}],
        extractTime: 1.5
        },
    ]
}

var fruits = ['at', 'bt', 'ort']
var fruitConfigs = [
	{
	assetId: 'at',
	takes: [{assetId: 'water', count: 5}],
	gives: [{extractId: 'aft', count: 3}],
  extractTime: 3
	},
	{
	assetId: 'bt',
	takes: [{assetId: 'water', count: 5}],
	gives: [{extractId: 'bft', count: 5}],
  extractTime: 5
	},
	{
	assetId: 'ort',
	takes: [{assetId: 'water', count: 10}],
	gives: [{extractId: 'oft', count: 2}],
  extractTime: 1
	}
]

var feedConfigs
function getConfigs(){
  $.ajax({
    url: "https://api.cropbytes.com/api/v1/game/launch",
    context: 'application/json',
    async: false
  }).done(function(data) {
      feedConfigs = data.data.feedConfigNew

    });
}

function getObjectKeysAlphabetical(obj) {
    var keys = []
    var newData = []
    $(obj).each(function (i, e) {
        if (cropLands.includes(e.id)){
            var cornClone = {}
            var carrotClone = {}
            Object.assign(cornClone, e);
            Object.assign(carrotClone, e);
            cornClone.cloneId = e.id + 'corn'
            carrotClone.cloneId = e.id + 'carrot'
            cornClone.name = e.name + ' (Corn)'
            carrotClone.name = e.name + ' (Carrot)'

            obj.splice(i, 1)
            newData.push(cornClone)
            newData.push(carrotClone)
            keys.push(cornClone.name)
            keys.push(carrotClone.name)
        }
        else {
            newData.push(e)
            keys.push(e.name)
        }
    })
    keys.sort();
    return {keys: keys, data: newData}
}

var currencies = []
function getCurrencies(){
  $.ajax({
    url: "https://api.cropbytes.com/api/v2/peatio/public/currencies",
    context: 'application/json',
    async: false
  }).done(function(data) {

    var newData = getObjectKeysAlphabetical(data)

    //i = 0, key = null, val = null;
    $(newData.keys).each(function (i, e) {
      var asset = newData.data.find(currency => currency.name == e)
      currencies.push(asset)
    })
    console.log('currencies', currencies)
      //currencies = data
    });
}

var tickers
function getTickers(){
  $.ajax({
    url: "https://api.cropbytes.com/api/v2/peatio/public/markets/tickers",
    context: 'application/json',
    async: false
  }).done(function(data) {
      tickers = data
    });
}

var markets
function getMarkets(){
  $.ajax({
    url: "https://api.cropbytes.com/api/v2/peatio/public/markets",
    context: 'application/json',
    async: false
  }).done(function(data) {
      markets = data

    });
}

var unixCurrentTime = Math.round(+new Date()/1000)

var cbxTradesArr
function getCbxTrades(){
  cbxTradesArr = {}
  $.ajax({
    url: "https://api.cropbytes.com/api/v2/peatio/public/markets/cbxusdt/k-line?period=1440&time_from=1580000000&time_to=" + unixCurrentTime + "",
    context: 'application/json',
    async: false
  }).done(function(data) {
    $(data).each(function(i, e){
    var dataDate = new Date((e[0])*1000)
    //var dictKey = dataDate.getFullYear() + '-' + (dataDate.getMonth() + 1) + '-' + dataDate.getDate()
    cbxTradesArr[e[0]] = e[1]
    /*var newDict = {}*/
    /*newDict['"' + dataDate.getFullYear() + '-' + (dataDate.getMonth() + 1) + '-' + dataDate.getDate() + '"'] = e[1]
    cbxTradesArr.push(newDict)*/
    })
    });
    return cbxTradesArr
}

var trxTradesArr
function getTrxTrades(){
  trxTradesArr = {}
  $.ajax({
    url: "https://api.cropbytes.com/api/v2/peatio/public/markets/trxusdt/k-line?period=1440&time_from=1580000000&time_to=" + unixCurrentTime + "",
    context: 'application/json',
    async: false
  }).done(function(data) {
    $(data).each(function(i, e){
    var dataDate = new Date((e[0])*1000)
    //var dictKey = dataDate.getFullYear() + '-' + (dataDate.getMonth() + 1) + '-' + dataDate.getDate()
    trxTradesArr[e[0]] = e[1]
    /*var newDict = {}
    newDict['"' + dataDate.getFullYear() + '-' + (dataDate.getMonth() + 1) + '-' + dataDate.getDate() + '"'] = e[1]
    trxTradesArr.push(newDict)*/
    })

    });
    return trxTradesArr
}

var assetUsdTradesArr
var assetTradesArr
function getAssetTrades(assetId, marketId){
  assetTradesArr = []
  assetUsdTradesArr = []
  var assetMarketTrades
  if (marketId === 'trx'){
    assetMarketTrades = trxTradesArr
  }
  else if (marketId === 'cbx'){
    assetMarketTrades = cbxTradesArr
  }

  $.ajax({
    url: "https://api.cropbytes.com/api/v2/peatio/public/markets/" + assetId + marketId +"/k-line?period=1440&time_from=1580000000&time_to=" + unixCurrentTime + "",
    context: 'application/json',
    async: false
  }).done(function(data) {
    $(data).each(function(i, e){
    var dataDate = new Date((e[0])*1000)
    //var dictKey = dataDate.getFullYear() + '-' + (dataDate.getMonth() + 1) + '-' + dataDate.getDate()

    if (!['trx', 'cbx'].includes(assetId)){
        var amtVal = assetMarketTrades[e[0]]
        var usdVal = amtVal * e[1]
        assetUsdTradesArr.push({ time: {year: dataDate.getFullYear(), month: dataDate.getMonth() + 1, day: dataDate.getDate()}, value: usdVal })
    }

    assetTradesArr.push({ time: {year: dataDate.getFullYear(), month: dataDate.getMonth() + 1, day: dataDate.getDate()}, value: e[1] })

    })
  });
  return [assetTradesArr, assetUsdTradesArr]
}

var consumptionTradesArr
var productionTradesArr
function getAssetPcTrades(consumptionIds, productionId, consumptionCounts, productionCount){
  consumptionTradesArr = []
  productionTradesArr = []
  consumptionTradesDict = {}
  productionTradesDict = {}

  if (consumptionIds.length > 0){
    $(consumptionIds).each(function(i, e){
    var getPrice_ = getPrice(e)
    var assetMarketTrades
    if (getPrice_.market === 'trx'){
        assetMarketTrades = trxTradesArr
    }
    else if (getPrice_.market === 'cbx'){
        assetMarketTrades = cbxTradesArr
    }
    $.ajax({
        url: "https://api.cropbytes.com/api/v2/peatio/public/markets/" + e + getPrice_.market +"/k-line?period=1440&time_from=1580000000&time_to=" + unixCurrentTime + "",
        context: 'application/json',
        async: false
          }).done(function(data){
            $(data).each(function(i2, e2){
              var dataDate = new Date((e2[0])*1000)

              //var dictKey = dataDate.getFullYear() + '-' + (dataDate.getMonth() + 1) + '-' + dataDate.getDate()
              if (!(e2[0] in consumptionTradesDict)){
                consumptionTradesDict[e2[0]] = (e2[1] * assetMarketTrades[e2[0]] * consumptionCounts[i])
              }
              else {
                consumptionTradesDict[e2[0]] += (e2[1] * assetMarketTrades[e2[0]] * consumptionCounts[i])
              }

            });
          });
      });
  }
    console.log('consumptionTradesDict', consumptionTradesDict)
  $.each(consumptionTradesDict, function(i, e){
    var dataDate = new Date((i)*1000)
    console.log('consumptionTradesDictttt', i, e)
    consumptionTradesArr.push({ time: {year: dataDate.getFullYear(), month: dataDate.getMonth() + 1, day: dataDate.getDate()}, value: e })
  });
  console.log('consumptionTradesArr', consumptionTradesArr)
  var getProdPrice_ = getPrice(productionId)
    var prodAssetMarketTrades
    if (getProdPrice_.market === 'trx'){
        prodAssetMarketTrades = trxTradesArr
    }
    else if (getProdPrice_.market === 'cbx'){
        prodAssetMarketTrades = cbxTradesArr
    }
  $.ajax({
    url: "https://api.cropbytes.com/api/v2/peatio/public/markets/" + productionId + getProdPrice_.market +"/k-line?period=1440&time_from=1580000000&time_to=" + unixCurrentTime + "",
    context: 'application/json',
    async: false
  }).done(function(data) {
    $(data).each(function(i, e){
      var dataDate = new Date((e[0])*1000)
      productionTradesArr.push({ time: {year: dataDate.getFullYear(), month: dataDate.getMonth() + 1, day: dataDate.getDate()}, value: e[1] * prodAssetMarketTrades[e[0]] * productionCount })
    })
  });
  return [consumptionTradesArr, productionTradesArr]
}

function showChart(assetId, assetMarketId, chartWidth){
    var getTrades = getAssetTrades(assetId, assetMarketId)
    var assetTrades =  getTrades[0]
    var assetUsdTrades =  getTrades[1]
    var chart = LightweightCharts.createChart('chartContainer', {
      width: chartWidth,
      height: 300,
        rightPriceScale: {
            visible: true,
            borderColor: 'rgba(197, 203, 206, 1)',
        },
        leftPriceScale: {
            visible: true,
            borderColor: 'rgba(197, 203, 206, 1)',
        },
        layout: {
            backgroundColor: '#100841',
		    textColor: '#ffffff',
        },
      grid: {
        vertLines: {
			color: 'rgba(197, 203, 206, 0.4)',
			style: LightweightCharts.LineStyle.Dotted,
		},
		horzLines: {
			color: 'rgba(197, 203, 206, 0.4)',
			style: LightweightCharts.LineStyle.Dotted,
		},
      },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        timeScale: {
            borderColor: 'rgba(197, 203, 206, 1)',
        },
        handleScroll: {
            vertTouchDrag: false,
        },
    });
    var marketSeries = chart.addLineSeries({
      color: 'rgba(67, 83, 254, 1)',
      lineWidth: 2,
      priceScaleId: 'right'
    });

    var usdSeries = chart.addLineSeries({
      color: 'rgba(255, 192, 0, 1)',
      lineWidth: 2,
      priceScaleId: 'left'
    });

    marketSeries.setData(assetTrades)
    usdSeries.setData(assetUsdTrades)

     chart.timeScale().fitContent();

    $('#chartContainer').css('position', 'relative')

    var legend = document.createElement('div');
    legend.classList.add('chartLegend');
    $('#chartContainer').append(legend);

    var firstRow = document.createElement('div');
    firstRow.innerText = assetId.toUpperCase() +  '/' + assetMarketId.toUpperCase();
    firstRow.style.color = 'rgba(67, 83, 254, 1)';
    legend.appendChild(firstRow);

    if (!['trx', 'cbx'].includes(assetId)){
        var secondRow = document.createElement('div');
        secondRow.innerText = assetId.toUpperCase() +  '/USD';
        secondRow.style.color = 'rgba(255, 192, 0, 1)';
        legend.appendChild(secondRow);
    }

}

function showPcChart(consumptionIds, productionId, chartWidth, consumptionCounts, productionCount){
    var getTrades = getAssetPcTrades(consumptionIds, productionId, consumptionCounts, productionCount)
    console.log('getTrades', getTrades)
    var consumptionTrades =  getTrades[0]
    var productionTrades =  getTrades[1]
    var chart = LightweightCharts.createChart('pcChartContainer', {
      width: chartWidth,
      height: 300,
        rightPriceScale: {
            visible: true,
            borderColor: 'rgba(197, 203, 206, 1)',
        },
        leftPriceScale: {
            visible: true,
            borderColor: 'rgba(197, 203, 206, 1)',
        },
        layout: {
            backgroundColor: '#100841',
		    textColor: '#ffffff',
        },
      grid: {
        vertLines: {
			color: 'rgba(197, 203, 206, 0.4)',
			style: LightweightCharts.LineStyle.Dotted,
		},
		horzLines: {
			color: 'rgba(197, 203, 206, 0.4)',
			style: LightweightCharts.LineStyle.Dotted,
		},
      },
        crosshair: {
            mode: LightweightCharts.CrosshairMode.Normal,
        },
        timeScale: {
            borderColor: 'rgba(197, 203, 206, 1)',
        },
        handleScroll: {
            vertTouchDrag: false,
        },
  });

  var prodSeries = chart.addAreaSeries({
      topColor: 'rgba(67, 83, 254, 0.7)',
      bottomColor: 'rgba(67, 83, 254, 0.3)',
      lineColor: 'rgba(67, 83, 254, 1)',
      lineWidth: 2,
      priceScaleId: 'right'
    });

    var consSeries = chart.addAreaSeries({
      topColor: 'rgba(255, 192, 0, 0.7)',
      bottomColor: 'rgba(255, 192, 0, 0.3)',
      lineColor: 'rgba(255, 192, 0, 1)',
      lineWidth: 2,
      priceScaleId: 'right'
    });

    prodSeries.setData(productionTrades)
    consSeries.setData(consumptionTrades)

    //chart.timeScale().fitContent();

    $('#pcChartContainer').css('position', 'relative')

    var legend = document.createElement('div');
    legend.classList.add('chartLegend');
    $('#pcChartContainer').append(legend);

    var firstRow = document.createElement('div');
    firstRow.innerText = 'Production Cost'
    firstRow.style.color = 'rgba(67, 83, 254, 1)';
    legend.appendChild(firstRow);

    if (consumptionIds.length > 0){
        var secondRow = document.createElement('div');
        secondRow.innerText = 'Consumption cost'
        secondRow.style.color = 'rgba(255, 192, 0, 1)';
        legend.appendChild(secondRow);
    }
}

var chartsModal = document.getElementById('chartsModal')
$('#chartsModal').on('show.bs.modal', function (event) {
  $('.loadingCont').fadeIn(1000)
  var assetMarket = ''
  var assetID = ''
  var modalTitle = ''
  var button = event.relatedTarget
  assetID = button.getAttribute('data-bs-asset_id')
  assetMarket = button.getAttribute('data-bs-market')
  var consumptionIdsList = []
  consumptionIds = button.getAttribute('data-bs-consumption_ids')
  consumptionIdsArr = consumptionIds.split(',')
  consumptionCounts = button.getAttribute('data-bs-consumption_counts')
  consumptionCountsArr = consumptionCounts.split(',')

  productionId = button.getAttribute('data-bs-production_id')
  productionCount = button.getAttribute('data-bs-production_count')
  $(this).find('#chartContainer').empty()
  $(this).find('#pcChartContainer').empty()
  $('#chartsModal').on('shown.bs.modal', function () {
    $('#chartContainer').empty()
    $('#pcChartContainer').empty()
    showChart(assetID, assetMarket, $('#chartContainer').width())
    showPcChart(consumptionIdsArr, productionId, $('#pcChartContainer').width(), consumptionCountsArr, productionCount)
    });
  $('.loadingCont').fadeOut(1000)
})



function getAssetName(assetId){
  var asset = currencies.find(currency => currency.id == assetId)
  if (typeof asset !== "undefined"){
    return asset.name
  }
  else {
    return ''
  }
}

function getCropLandName(assetId){
  var asset = currencies.find(currency => currency.cloneId == assetId)
  if (typeof asset !== "undefined"){
    return asset.name
  }
  else {
    return ''
  }
}

function getPrice(assetId){
  var asset = markets.find(market => market.base_unit == assetId)
  if (typeof asset !== "undefined"){
    var market = asset.base_unit + asset.quote_unit
    return {'price': tickers[market].ticker.last, 'market': asset.quote_unit, 'type': 'Market'}
  }
  else {
    var curr = currencies.find(currency => currency.id == assetId)
    if (typeof curr !== "undefined"){

        return {'price': curr.default_price, 'market': 'trx', 'type': 'Default'}
      }
    else {
        return {'price': 0, 'market': ''}
    }

  }

}


function getFiatDefault(){
    var fiat = window.localStorage.getItem('fiat_default')
    var fiat_conversion
    $.ajax({
        url: "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd/" + fiat + ".json",
        context: 'application/json',
        async: false
      }).done(function(data) {
          fiat_conversion =  data[fiat]
    });
    return fiat_conversion
}


function getUsdPrice(market, price){
  if (typeof market !== "undefined" || typeof price !== "undefined"){
    if (market == 'usdt'){
      return price
    }
    else {
      var marketUsdPrice = getPrice(market).price
      var usd_price = (parseFloat(marketUsdPrice) * parseFloat(price)).toFixed(3)
      var fiat_default = window.localStorage.getItem('fiat_default')
      console.log('fiat_default', getFiatDefault())
      if (fiat_default !== 'usd'){
        usd_price = parseFloat(usd_price) * getFiatDefault()
      }
      if (isNaN(usd_price)){
        return ''
      }
      else {
        return usd_price
      }
    }
  }
  else {
    return ''
  }
}

function getRoi(price, profit){
    var roi = ~~(parseFloat(price)/parseFloat(profit))
    if (!isFinite(roi) | parseFloat(profit) < 0) {
        return 0
    }
    else {
        return roi
    }
}

function getAssetTakes(assetId){
  var takes_cont = $('<table></table>')
  var asset = feedConfigs.find(config => config.assetId == assetId)
  var totalPrice = 0
  var feedTime = 0
  var assetTakesList = []
  var assetTakesCountList = []
  if (typeof asset !== "undefined"){
    feedTime = asset.feedTime
    if (asset.takes.other.length > 0){
      $(takes_cont).append('<tr><th colspan="3">Mon-Sat:</th></tr>');
      $(asset.takes.other).each(function(i, e){
        var item_market_price = getPrice(e.assetId)
        var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
        $(takes_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.assetId) + '</td><td style="padding-left: 5px;"> ' + (e.count * usd_price).toFixed(3) + ' ' + fiat_default.toUpperCase() + '</td></tr>')
        totalPrice += ((6/feedTime) * (parseFloat(e.count * usd_price)))
        assetTakesList.push(e.assetId)
        assetTakesCountList.push((e.count * (6/feedTime))/6)
      });
    }
    if (asset.takes.sun.length > 0){
      $(takes_cont).append('<tr><th colspan="3">Sun:</th></tr>');
      $(asset.takes.sun).each(function(i, e){
        var item_market_price = getPrice(e.assetId)
        var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
        $(takes_cont).append('<tr><td style="padding:0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.assetId) + '</td><td style="padding-left: 5px;"> ' + (e.count * usd_price).toFixed(3) + ' ' + fiat_default.toUpperCase() +  '</td></tr>')
        totalPrice += parseFloat(e.count * usd_price)
      });
    }
    return [takes_cont.prop('outerHTML'), totalPrice, feedTime, assetTakesList, assetTakesCountList]
  }
  else {
    return ['', 0]
  }
}


function getAssetGives(assetId){
  var gives_cont = $('<table></table>')
  var asset = feedConfigs.find(config => config.assetId == assetId)
  var totalPrice = 0
  var extractTime = 0
  var assetGives
  var assetGivesCount
  if (typeof asset !== "undefined"){
    extractTime = asset.extractTime
    if (asset.gives.length > 0){
      $(asset.gives).each(function(i, e){
        var item_market_price = getPrice(e.extractId)
        var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
        $(gives_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.extractId) + '</td><td style="padding-left: 5px;"> ' + (e.count * usd_price).toFixed(3) + ' ' + fiat_default.toUpperCase() +  '</td></tr>')
        totalPrice += (e.count * usd_price)
        assetGives = e.extractId
        assetGivesCount = (e.count * (7/extractTime)) / 7
      });
    }
    return [gives_cont.prop('outerHTML'), totalPrice, extractTime, assetGives, assetGivesCount]
  }
  else {
    return ['', 0, 0]
  }
}

function getFruitTakes(assetId){
  var takes_cont = $('<table></table>')
  var asset = fruitConfigs.find(config => config.assetId == assetId)
  var totalPrice = 0
  var fruitTakesList = []
  var fruitTakesCountList = []
  if (typeof asset !== "undefined"){
    if (asset.takes.length > 0){
      //$(takes_cont).append('<tr><th>Mon-Sat:</th><th></th></tr>');
      $(asset.takes).each(function(i, e){
        var item_market_price = getPrice(e.assetId)
        var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
        $(takes_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.assetId) + '</td><td style="padding-left: 5px;"> ' + (e.count * usd_price).toFixed(3) + ' ' + fiat_default.toUpperCase() +  '</td></tr>')
        //$(takes_cont).append('<tr><td colspan="3">Grinding fee: 0.01 trx/crop</td></tr>')
        totalPrice += parseFloat(e.count * usd_price)
        //(parseFloat((0.01 * e.count) * getUsdPrice('usdt', getPrice('trx').price)) - if include grinding fee
        fruitTakesList.push(e.assetId)
        fruitTakesCountList.push(e.count)
      });
    }
    return [takes_cont.prop('outerHTML'), totalPrice, fruitTakesList, fruitTakesCountList]
  }
  else {
    return ['', 0]
  }
}

function getFruitGives(assetId){
  var gives_cont = $('<table></table>')
  var asset = fruitConfigs.find(config => config.assetId == assetId)
  var totalPrice = 0
  var extractTime = 0
  var fruitGives
  var fruitGivesCount
  if (typeof asset !== "undefined"){
    extractTime = asset.extractTime
    if (asset.gives.length > 0){
      $(asset.gives).each(function(i, e){
        var item_market_price = getPrice('frf')
        var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
        $(gives_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.extractId) + '</td><td style="padding-left: 5px;"> ' + (e.count * usd_price).toFixed(3) + ' ' + fiat_default.toUpperCase() +  '</td></tr>')
        totalPrice += parseFloat(e.count * usd_price)
        fruitGives = 'frf'
        fruitGivesCount = e.count
      });
    }
    return [gives_cont.prop('outerHTML'), totalPrice, extractTime, fruitGives, fruitGivesCount]
  }
  else {
    return ['', 0, 0]
  }
}


function getWellGives(assetId){
  var gives_cont = $('<table></table>')
  var asset = wellConfigs.find(config => config.assetId == assetId)
  var totalPrice = 0
  var extractTime = 0
  var wellGives
  var wellGivesCount
  if (typeof asset !== "undefined"){
    extractTime = Math.round((asset.extractTime + Number.EPSILON) * 100) / 100
    if (asset.gives.length > 0){
      $(asset.gives).each(function(i, e){
        var item_market_price = getPrice(e.extractId)
        var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
        $(gives_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.extractId) + '</td><td style="padding-left: 5px;"> ' + (e.count * usd_price).toFixed(3) + ' ' + fiat_default.toUpperCase() +  '</td></tr>')
        totalPrice += parseFloat(e.count * usd_price)
        wellGives = e.extractId
        wellGivesCount = (e.count * (7/extractTime)) / 7
      });
    }
    return [gives_cont.prop('outerHTML'), totalPrice, extractTime, wellGives, wellGivesCount]
  }
  else {
    return ['', 0, 0]
  }
}


function getCropTakes(assetId, cloneId){
  var takes_cont = $('<table></table>')
  var asset
  var grindingFee
  if (typeof cloneId !== "undefined"){
    if (cloneId.slice(3) == 'corn'){
        asset = cropConfigs.corn.find(config => config.assetId == assetId)
        grindingFee = 0.01
      }
      else if (cloneId.slice(3) == 'carrot'){
        asset = cropConfigs.carrot.find(config => config.assetId == assetId)
        grindingFee = 0.5
      }
  }
  var totalPrice = 0
  var cropTakesList = []
  var cropTakesCountList = []
  if (typeof asset !== "undefined"){
    if (asset.takes.length > 0){
      //$(takes_cont).append('<tr><th>Mon-Sat:</th><th></th></tr>');
      $(asset.takes).each(function(i, e){
        var item_market_price = getPrice(e.assetId)
        var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
        $(takes_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.assetId) + '</td><td style="padding-left: 5px;"> ' + (e.count * usd_price).toFixed(3) + ' ' + fiat_default.toUpperCase() +  '</td></tr>')
        //$(takes_cont).append('<tr><td colspan="3">Grinding fee: 0.01 trx/crop</td></tr>')
        totalPrice += parseFloat(e.count * usd_price)
        // (parseFloat((grindingFee * e.count) * getUsdPrice('usdt', getPrice('trx').price)) if include grinding fee
        cropTakesList.push(e.assetId)
        cropTakesCountList.push(e.count)
      });
    }
    return [takes_cont.prop('outerHTML'), totalPrice, cropTakesList, cropTakesCountList]
  }
  else {
    return ['', 0]
  }
}

function getCropGives(assetId, cloneId){
  var gives_cont = $('<table></table>')
  var asset

  if (typeof cloneId !== "undefined"){
    if (cloneId.slice(3) == 'corn'){
        asset = cropConfigs.corn.find(config => config.assetId == assetId)
      }
      else if (cloneId.slice(3) == 'carrot'){
        asset = cropConfigs.carrot.find(config => config.assetId == assetId)
      }
  }

  var totalPrice = 0
  var extractTime = 0
  var cropGivesCount
  var cropGives
  if (typeof asset !== "undefined"){
    extractTime = asset.extractTime
    if (asset.gives.length > 0){
      $(asset.gives).each(function(i, e){
        var item_market_price = getPrice(e.extractId)
        var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
        $(gives_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.extractId) + '</td><td style="padding-left: 5px;"> ' + (e.count * usd_price).toFixed(3) + ' ' + fiat_default.toUpperCase() +  '</td></tr>')
        totalPrice += parseFloat(e.count * usd_price)
        cropGives = e.extractId
        cropGivesCount = (e.count * (7/extractTime)) / 7
        //console.log(totalPrice, extractTime)
      });
    }
    return [gives_cont.prop('outerHTML'), totalPrice, extractTime, cropGives, cropGivesCount]
  }
  else {
    return ['', 0, 0]
  }
}



function showCards(){
  $(currencies).each(function(i, e){
      var daily_profit
      var harvestTime
      var feedTime
      var item_market_price = getPrice(e.id)
      var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
      //console.log(e.id, getAssetTakes(e.id)[1], getAssetGives(e.id)[2])
      //console.log(e.id, getFruitGives(e.id)[1], getFruitTakes(e.id)[1], getFruitGives(e.id)[2])
      if (fruits.includes(e.id)){
          harvestTime = getFruitGives(e.id)[2]
          daily_profit = ((getFruitGives(e.id)[1] - getFruitTakes(e.id)[1]) / getFruitGives(e.id)[2])
        }
      else if (wells.includes(e.id)){
          harvestTime = (getWellGives(e.id)[2])
          daily_profit = (getWellGives(e.id)[1] / getWellGives(e.id)[2])
      }
      else if (cropLands.includes(e.id)){
          //console.log(getCropGives(e.id, e.cloneId)[1], getCropTakes(e.id, e.cloneId)[1], getCropGives(e.id, e.cloneId)[2])
          feedTime = 0
          harvestTime = (getCropGives(e.id, e.cloneId)[2])
          daily_profit = (getCropGives(e.id, e.cloneId)[1] - getCropTakes(e.id, e.cloneId)[1]) / getCropGives(e.id, e.cloneId)[2]

      }
      else {
        if (getAssetGives(e.id)[2] > 0){
          feedTime = getAssetTakes(e.id)[2]
          harvestTime = getAssetGives(e.id)[2]
          daily_profit = ((getAssetGives(e.id)[1] * (7/harvestTime)) - getAssetTakes(e.id)[1]) / 7
        }
        else {
          daily_profit = 0
          harvestTime = 0
          feedTime = 0
        }
      }

      var item_qty
      if (cropLands.includes(e.id)){
        item_qty = window.localStorage.getItem(e.cloneId) || 0;
      }
      else {
        item_qty = window.localStorage.getItem(e.id) || 0;
      }
      var mining_v_exchange = getMiningVsExchange(e.id)
      var mining_return_color = {}
      if (mining_v_exchange.mining_return > mining_v_exchange.exchange_return){
        mining_return_color = {'mining': 'red', 'exchange': 'blue'}
      }
      else {
        mining_return_color = {'mining': 'blue', 'exchange': 'red'}
      }
      var bsmStatus
      if (extractsMiningRequirements[e.id] > mining_v_exchange.exchange_return){
        bsmStatus = {'status': 'Sell', 'color': 'red'}
      }
      else if (mining_v_exchange.mining_return <= mining_v_exchange.exchange_return){
        bsmStatus = {'status': 'Mine', 'color': 'green'}
      }
      else if (mining_v_exchange.exchange_return < mining_v_exchange.mining_return){
        bsmStatus = {'status': 'Buy', 'color': 'blue'}
      }
      var card_body
      if (extracts.includes(e.id)){
        card_body = '    <div class="row">' +
                  '         <div class="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 px-1">Conversion rate: ' + extractsMiningRequirements[e.id] + ' ' + e.id + '/ 1 cbx</div>' +
                  '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: ' + mining_return_color.mining + ';">Mining conversion: </div> ' + parseFloat(mining_v_exchange.mining_return).toFixed(1) + ' ' + e.id +  '/ 1 cbx</div>' +
                  '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: ' + mining_return_color.exchange + ';">Exchange conversion: </div>' + parseFloat(mining_v_exchange.exchange_return).toFixed(1) + ' ' + e.id + '/ 1 cbx</div>' +
                  '         <div class="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 px-1" style="margin-top: 5px;">Est. DL 1 price: <span style="color: ' + bsmStatus.color + ';"> ' + mining_v_exchange.est_dl1_price.toFixed(3) +  ' cbx</span></div>' +
                  '         <div class="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 px-1">Status: <span style="color: ' + bsmStatus.color + ';"> ' + bsmStatus.status +  '</span></div>' +
                  '         <div class="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 px-1"> Est. next mining conversion: ' + parseFloat(mining_v_exchange.next_mining_return).toFixed(1) + ' ' + e.id + '/ 1 cbx</div>' +
                  '    </div>'
      }
      else {
        var feedHarvestRow
        if (fruits.includes(e.id) | cropLands.includes(e.id) | wells.includes(e.id)){
            feedHarvestRow = '<div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: blue;">Harvest Time: </div>' + harvestTime + ' days</div>'
        }
        else {
            feedHarvestRow = '<div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: red;">Feed Time: </div> ' + feedTime +  ' days</div>' +
                             '<div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: blue;">Harvest Time: </div>' + harvestTime + ' days</div>'
        }
        card_body = '  <div class="card-text" style="color: red;"> Takes: </div> ' + getAssetTakes(e.id)[0] + getFruitTakes(e.id)[0] + getCropTakes(e.id, e.cloneId)[0] +
                  '    <div class="card-text" style="color: blue;"> Gives: </div> ' + getAssetGives(e.id)[0] + getFruitGives(e.id)[0] + getWellGives(e.id)[0] + getCropGives(e.id, e.cloneId)[0] +
                  '    <div class="row">' + feedHarvestRow +
                  '    </div>' +
                  '    <div class="row">' +
                  '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: blue;">Daily Profit: </div> ' + daily_profit.toFixed(3) + ' ' + fiat_default.toUpperCase() +  '</div>' +
                  '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: blue;">ROI: </div>' + getRoi(usd_price, daily_profit) + ' days</div>' +
                  '    </div>'
      }
      //var item_qty = window.localStorage.getItem(e.id) || 0;

      var asset_gives = []
      var asset_gives_count = []
      if (typeof getAssetGives(e.id)[3] !== "undefined"){
        var getAssetGives_ = getAssetGives(e.id)
        asset_gives.push(getAssetGives_[3])
        asset_gives_count.push(getAssetGives_[4])
      }
      else if (typeof getFruitGives(e.id)[3] !== "undefined"){
        var getFruitGives_ = getFruitGives(e.id)
        asset_gives.push(getFruitGives_[3])
        asset_gives_count.push(getFruitGives_[4])
      }
      else if (typeof getWellGives(e.id)[3] !== "undefined"){
        var getWellGives_ = getWellGives(e.id)
        asset_gives.push(getWellGives_[3])
        asset_gives_count.push(getWellGives_[4])
      }
      else if (typeof getCropGives(e.id, e.cloneId)[3] !== "undefined"){
        var getCropGives_ = getCropGives(e.id, e.cloneId)
        asset_gives.push(getCropGives_[3])
        asset_gives_count.push(getCropGives_[4])
      }
    console.log('asset_gives', e.id, getAssetGives(e.id)[3], getFruitGives(e.id)[3], getWellGives(e.id)[3], getCropGives(e.id, e.cloneId)[3], asset_gives)

      var asset_takes = []
      var asset_takes_count = []
      if (typeof getAssetTakes(e.id)[3] !== "undefined"){
        var getAssetTakes_ = getAssetTakes(e.id)
        asset_takes.push(getAssetTakes_[3])
        asset_takes_count.push(getAssetTakes_[4])
      }
      else if (typeof getFruitTakes(e.id)[2] !== "undefined"){
        var getFruitTakes_ = getFruitTakes(e.id)
        asset_takes.push(getFruitTakes_[2])
        asset_takes_count.push(getFruitTakes_[3])
      }
      else if (typeof getCropTakes(e.id, e.cloneId)[2]){
        var getCropTakes_ = getCropTakes(e.id, e.cloneId)
        asset_takes.push(getCropTakes_[2])
        asset_takes_count.push(getCropTakes_[3])
      }
      console.log('asset_takes', e.id, getAssetTakes(e.id)[2], getFruitTakes(e.id)[2], getCropTakes(e.id, e.cloneId)[2], asset_takes)
      var production_id = asset_gives
      var consumption_ids = asset_takes
      var card = '<div class="col-6 col-xl-2 col-lg-2 col-md-2 col-sm-6 col-xs-6">' +
                  '<div class="card" aria-hidden="true">'+
                  ' <img src="' + e.icon_url + '" class="card-img-top" alt="icon">' +
                  ' <div class="card-body"> ' +
                  '  <div style="font-size: 12px;"><strong>'  + e.name + '</strong></div> ' +
                  '  <div class="input-group mb-3">' +
                  '    <button class="btn btn-primary btn-sm minus_btn" type="button" id="minus_' + e.id + '_btn">-</button>' +
                  '    <span class="form-control text-center asset_input" data-crop_type="' + e.cloneId + '" data-asset_id="' + e.id + '" id="asset_' + e.id + '_qty">' + item_qty + '</span>' +
                  '    <button class="btn btn-primary btn-sm add_btn" type="button" id="plus_' + e.id + '_btn">+</button>' +
                  '  </div>' +
                  '  <div>' + item_market_price.type + ' price: ' + item_market_price.price +' ' + item_market_price.market + ' (' + parseFloat(usd_price).toFixed(2)  + ' ' + fiat_default.toUpperCase() +  ') <button class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#chartsModal" data-bs-asset_id="'+ e.id +'" data-bs-market="' + item_market_price.market + '" data-bs-production_id="' + production_id + '" data-bs-production_count="' + asset_gives_count + '" data-bs-consumption_ids="' + consumption_ids + '" data-bs-consumption_counts="' + asset_takes_count + '" style="padding:0;"><i class="bi bi-graph-up"></i></button></div>' +
                  ' ' + card_body +
                  /*'    <div class="card-text" style="color: red;"> Takes: </div> ' + getAssetTakes(e.id)[0] + getFruitTakes(e.id)[0] + getCropTakes(e.id, e.cloneId)[0] +
                  '    <div class="card-text" style="color: blue;"> Gives: </div> ' + getAssetGives(e.id)[0] + getFruitGives(e.id)[0] + getWellGives(e.id)[0] + getCropGives(e.id, e.cloneId)[0] +
                  '    <div class="card-text" style="color: blue;"> Harvest time: </div> ' + harvestTime + ' days' +
                  '    <div class="row">' +
                  '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: blue;">Daily Profit: </div> ' + daily_profit.toFixed(3) + ' ' + fiat_default.toUpperCase() +  '</div>' +
                  '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: blue;">ROI: </div>' + getRoi(usd_price, daily_profit) + ' days</div>' +
                  '    </div>' +*/
                  '</div>' +
                ' </div>' +
                '</div>'
      $('#items-container').append(card)
    });
}

function updateSummary(){
    $('#assets-container').empty();
    $('#production-container').empty()
    $('#consumption-container').empty()
    var total_production = 0
    var total_consumption = 0
    var total_assets = 0
    $.each(window.localStorage, function(i, e){
        if (i !== 'production' || i !== 'consumption'){
            if (window.localStorage.getItem(i) > 0){
                if (cropLandsClone.includes(i)){
                    var orig_i = i.slice(0, 3)
                    var item_market_price = getPrice(orig_i)
                    var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
                    console.log('orig_i', i, orig_i)
                    $('#assets-container').append('<div class="asset_summary"><span>' + getCropLandName(i) + ' = </span><span> ' + window.localStorage.getItem(i) + ' </span><span>(' + (window.localStorage.getItem(i) * usd_price).toFixed(3) + ' ' + fiat_default.toUpperCase() +  ')</span></div>')
                    total_assets += parseFloat(window.localStorage.getItem(i)) * parseFloat(usd_price)
                }
                else {
                    var item_market_price = getPrice(i)
                    var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
                    $('#assets-container').append('<div class="asset_summary"><span>' + getAssetName(i) + ' = </span><span> ' + window.localStorage.getItem(i) + ' </span><span>(' + (window.localStorage.getItem(i) * usd_price).toFixed(3) + ' ' + fiat_default.toUpperCase() +  ')</span></div>')
                    total_assets += parseFloat(window.localStorage.getItem(i)) * parseFloat(usd_price)
                }
                //$('#assets-container').append('<div><span>' + getAssetName(i) + ' = </span><span> ' + window.localStorage.getItem(i) + ' </span><span>($' + (window.localStorage.getItem(i) * getUsdPrice(getPrice(i).market, getPrice(i).price)).toFixed(3) + ')</span></div>')
            }
        }
    })
    var production = JSON.parse(window.localStorage.getItem('production'))
    $.each(production, function(i, e){
        var item_market_price = getPrice(e.assetId)
        var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
        total_production += parseFloat(e.count) * parseFloat(usd_price)
        if (e.count > 0.0001){
            $('#production-container').append('<div class="asset_summary"><span>' + getAssetName(e.assetId) + ' = </span><span> ' + e.count.toFixed(3) + ' </span><span> (' + (parseFloat(e.count) * usd_price).toFixed(3) + ' ' + fiat_default.toUpperCase() +  ')</span></div>')
        }
    })
    var consumption = JSON.parse(window.localStorage.getItem('consumption'))
    $.each(consumption, function(i, e){
        var item_market_price = getPrice(e.assetId)
        var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
        total_consumption += parseFloat(e.count) * parseFloat(usd_price)
        if (e.count > 0.0001){
            $('#consumption-container').append('<div class="asset_summary"><span>' + getAssetName(e.assetId) + ' = </span><span> ' + (e.count).toFixed(3) + ' </span><span> (' + (parseFloat(e.count) * parseFloat(usd_price)).toFixed(3) + ' ' + fiat_default.toUpperCase() +  ')</span></div>')
        }
    })
    console.log('tp', total_production, total_consumption)
    var daily_profit = parseFloat(parseFloat(total_production) - parseFloat(total_consumption))
    $('#tdp').text(' ' + total_production.toFixed(2) + ' ' + fiat_default.toUpperCase())
    $('#tdc').text(' ' + total_consumption.toFixed(2) + ' ' + fiat_default.toUpperCase() )
    $('#ta').text(' ' + total_assets.toFixed(2) + ' ' + fiat_default.toUpperCase() )
    $('#daily-profit').text(' ' + daily_profit.toFixed(3) + ' ' + fiat_default.toUpperCase() )
    $('#weekly-profit').text(' ' + (daily_profit * 7).toFixed(2) + ' ' + fiat_default.toUpperCase() )
    $('#monthly-profit').text(' ' + (daily_profit * 30).toFixed(2) + ' ' + fiat_default.toUpperCase() )
}



$(document).on('click', '.add_btn', function () {
    var asset_val = parseInt($(this).siblings('.asset_input').text());
    var asset_id = $(this).siblings('.asset_input').data('asset_id');
    var crop_type = $(this).siblings('.asset_input').data('crop_type');
    asset_val += 1
    $(this).siblings('.asset_input').text(asset_val)

    if (crop_type !== "undefined"){
        window.localStorage.setItem(crop_type, asset_val);
    }
    else {
        window.localStorage.setItem(asset_id, asset_val);
    }
    //window.localStorage.setItem(asset_id, asset_val);
    var production = JSON.parse(window.localStorage.getItem('production')) || [];
    var consumption = JSON.parse(window.localStorage.getItem('consumption')) || [];

    if (fruits.includes(asset_id)){
        var fruit_asset = fruitConfigs.find(config => config.assetId == asset_id)
        if (typeof fruit_asset !== "undefined"){
            if (fruit_asset.takes.length > 0){
                $(fruit_asset.takes).each(function(i, e){
                    //var consumption = JSON.parse(window.localStorage.getItem('consumption')) || [];
                    var cons_item = consumption.find(cons_item => cons_item.assetId == e.assetId)
                    if (cons_item){
                        cons_item.count += parseFloat(parseFloat(e.count/fruit_asset.extractTime).toFixed(3))
                    }
                    else {
                        consumption.push({assetId: e.assetId, count: parseFloat(parseFloat(e.count/fruit_asset.extractTime).toFixed(3))})
                    }
                    window.localStorage.setItem('consumption', JSON.stringify(consumption));
                });
            }

            if (fruit_asset.gives.length > 0){
                $(fruit_asset.gives).each(function(i, e){
                    //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                    var prod_item = production.find(prod_item => prod_item.assetId == 'frf')
                    if (prod_item){
                        prod_item.count += parseFloat(parseFloat(e.count/fruit_asset.extractTime).toFixed(3))
                    }
                    else {
                        production.push({assetId: 'frf', count: parseFloat(parseFloat(e.count/fruit_asset.extractTime).toFixed(3))})
                    }
                    window.localStorage.setItem('production', JSON.stringify(production));
                });
            }
        }
    }
    else if (cropLands.includes(asset_id)){
        //var crop_type = $(this).siblings('.asset_input').data('crop_type');
        if (crop_type == asset_id + 'corn'){
            var corn_asset = cropConfigs.corn.find(config => config.assetId == asset_id)
            if (typeof corn_asset !== "undefined"){
                if (corn_asset.takes.length > 0){
                    $(corn_asset.takes).each(function(i, e){
                        //var consumption = JSON.parse(window.localStorage.getItem('consumption')) || [];
                        var cons_item = consumption.find(cons_item => cons_item.assetId == e.assetId)
                        if (cons_item){
                            cons_item.count += parseFloat(parseFloat(e.count/corn_asset.extractTime).toFixed(3))
                        }
                        else {
                            consumption.push({assetId: e.assetId, count: parseFloat(parseFloat(e.count/corn_asset.extractTime).toFixed(3))})
                        }
                        window.localStorage.setItem('consumption', JSON.stringify(consumption));
                    });
                }

                if (corn_asset.gives.length > 0){
                    $(corn_asset.gives).each(function(i, e){
                        //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                        var prod_item = production.find(prod_item => prod_item.assetId == e.extractId)
                        if (prod_item){
                            prod_item.count += parseFloat(parseFloat(e.count/corn_asset.extractTime).toFixed(3))
                        }
                        else {
                            production.push({assetId: e.extractId, count: parseFloat(parseFloat(e.count/corn_asset.extractTime).toFixed(3))})
                        }
                        window.localStorage.setItem('production', JSON.stringify(production));
                    });
                }
            }
        }
        else if (crop_type == asset_id + 'carrot'){
            var carrot_asset = cropConfigs.carrot.find(config => config.assetId == asset_id)
            if (typeof carrot_asset !== "undefined"){
                if (carrot_asset.takes.length > 0){
                    $(carrot_asset.takes).each(function(i, e){
                        //var consumption = JSON.parse(window.localStorage.getItem('consumption')) || [];
                        var cons_item = consumption.find(cons_item => cons_item.assetId == e.assetId)
                        if (cons_item){
                            cons_item.count += parseFloat(parseFloat(e.count/carrot_asset.extractTime).toFixed(3))
                        }
                        else {
                            consumption.push({assetId: e.assetId, count: parseFloat(parseFloat(e.count/carrot_asset.extractTime).toFixed(3))})
                        }
                        window.localStorage.setItem('consumption', JSON.stringify(consumption));
                    });
                }

                if (carrot_asset.gives.length > 0){
                    $(carrot_asset.gives).each(function(i, e){
                        //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                        var prod_item = production.find(prod_item => prod_item.assetId == e.extractId)
                        if (prod_item){
                            prod_item.count += parseFloat(parseFloat(e.count/carrot_asset.extractTime).toFixed(3))
                        }
                        else {
                            production.push({assetId: e.extractId, count: parseFloat(parseFloat(e.count/carrot_asset.extractTime).toFixed(3))})
                        }
                        window.localStorage.setItem('production', JSON.stringify(production));
                    });
                }
            }
        }
    }
    else if (wells.includes(asset_id)){
        var well_asset = wellConfigs.find(config => config.assetId == asset_id)
        if (typeof well_asset !== "undefined"){
            if (well_asset.gives.length > 0){
                $(well_asset.gives).each(function(i, e){
                    //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                    var prod_item = production.find(prod_item => prod_item.assetId == e.extractId)
                    if (prod_item){
                        prod_item.count += parseFloat(parseFloat(e.count/well_asset.extractTime).toFixed(3))
                    }
                    else {
                        production.push({assetId: e.extractId, count: parseFloat(parseFloat(e.count/well_asset.extractTime).toFixed(3))})
                    }
                    window.localStorage.setItem('production', JSON.stringify(production));
                });
            }
        }
    }
    else {
        var feed_asset = feedConfigs.find(config => config.assetId == asset_id)
        if (typeof feed_asset !== "undefined"){
            if (feed_asset.takes.other.length > 0){
                $(feed_asset.takes.other).each(function(i, e){
                    //var consumption = JSON.parse(window.localStorage.getItem('consumption')) || [];
                    var cons_item = consumption.find(cons_item => cons_item.assetId == e.assetId)
                    if (cons_item){
                        cons_item.count += parseFloat(parseFloat((e.count * 6)/7).toFixed(3))
                    }
                    else {
                        consumption.push({assetId: e.assetId, count: parseFloat(parseFloat((e.count * 6)/7).toFixed(3))})
                    }
                    window.localStorage.setItem('consumption', JSON.stringify(consumption));
                });
            }
            if (feed_asset.takes.sun.length > 0){
                $(feed_asset.takes.sun).each(function(i, e){
                    //var consumption = JSON.parse(window.localStorage.getItem('consumption')) || [];
                    var cons_item = consumption.find(cons_item => cons_item.assetId == e.assetId)
                    if (cons_item){
                        cons_item.count += parseFloat(parseFloat(e.count/7).toFixed(3))
                    }
                    else {
                        consumption.push({assetId: e.assetId, count: parseFloat(parseFloat(e.count/7).toFixed(3))})
                    }
                    window.localStorage.setItem('consumption', JSON.stringify(consumption));
                });
            }

            if (feed_asset.gives.length > 0){
                $(feed_asset.gives).each(function(i, e){
                    //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                    var prod_item = production.find(prod_item => prod_item.assetId == e.extractId)
                    if (prod_item){
                        prod_item.count += parseFloat(parseFloat(e.count / feed_asset.extractTime).toFixed(3))
                    }
                    else {
                        production.push({assetId: e.extractId, count: parseFloat(parseFloat(e.count / feed_asset.extractTime).toFixed(3))})
                    }
                    window.localStorage.setItem('production', JSON.stringify(production));
                });
            }
        }
    }
    updateSummary();
});

$(document).on('click', '.minus_btn', function () {
    var asset_val = parseInt($(this).siblings('.asset_input').text());
    var asset_id = $(this).siblings('.asset_input').data('asset_id');
    var crop_type = $(this).siblings('.asset_input').data('crop_type');
    asset_val -= 1
    if (asset_val > -1){
        $(this).siblings('.asset_input').text(asset_val)
        if (crop_type !== "undefined"){
            window.localStorage.setItem(crop_type, asset_val);
        }
        else {
            window.localStorage.setItem(asset_id, asset_val);
        }
        //window.localStorage.setItem(asset_id, asset_val);
        var production = JSON.parse(window.localStorage.getItem('production')) || [];
        var consumption = JSON.parse(window.localStorage.getItem('consumption')) || [];

        if (fruits.includes(asset_id)){
            var fruit_asset = fruitConfigs.find(config => config.assetId == asset_id)
            if (typeof fruit_asset !== "undefined"){
                if (fruit_asset.takes.length > 0){
                    $(fruit_asset.takes).each(function(i, e){
                        //var consumption = JSON.parse(window.localStorage.getItem('consumption')) || [];
                        var cons_item = consumption.find(cons_item => cons_item.assetId == e.assetId)
                        if (cons_item){
                            cons_item.count -= parseFloat(parseFloat(e.count/fruit_asset.extractTime).toFixed(3))
                        }
                        else {
                            consumption.push({assetId: e.assetId, count: parseFloat(parseFloat(e.count/fruit_asset.extractTime).toFixed(3))})
                        }
                        window.localStorage.setItem('consumption', JSON.stringify(consumption));
                    });
                }

                if (fruit_asset.gives.length > 0){
                    $(fruit_asset.gives).each(function(i, e){
                        //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                        var prod_item = production.find(prod_item => prod_item.assetId == 'frf')
                        if (prod_item){
                            prod_item.count -= parseFloat(parseFloat(e.count/fruit_asset.extractTime).toFixed(3))
                        }
                        else {
                            production.push({assetId: 'frf', count: parseFloat(parseFloat(e.count/fruit_asset.extractTime).toFixed(3))})
                        }
                        window.localStorage.setItem('production', JSON.stringify(production));
                    });
                }
            }
        }
        else if (cropLands.includes(asset_id)){
            //var crop_type = $(this).siblings('.asset_input').data('crop_type');
            if (crop_type == asset_id + 'corn'){
                var corn_asset = cropConfigs.corn.find(config => config.assetId == asset_id)
                if (typeof corn_asset !== "undefined"){
                    if (corn_asset.takes.length > 0){
                        $(corn_asset.takes).each(function(i, e){
                            //var consumption = JSON.parse(window.localStorage.getItem('consumption')) || [];
                            var cons_item = consumption.find(cons_item => cons_item.assetId == e.assetId)
                            if (cons_item){
                                cons_item.count -= parseFloat(parseFloat(e.count/corn_asset.extractTime).toFixed(3))
                            }
                            else {
                                consumption.push({assetId: e.assetId, count: parseFloat(parseFloat(e.count/corn_asset.extractTime).toFixed(3))})
                            }
                            window.localStorage.setItem('consumption', JSON.stringify(consumption));
                        });
                    }

                    if (corn_asset.gives.length > 0){
                        $(corn_asset.gives).each(function(i, e){
                            //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                            var prod_item = production.find(prod_item => prod_item.assetId == e.extractId)
                            if (prod_item){
                                prod_item.count -= parseFloat(parseFloat(e.count/corn_asset.extractTime).toFixed(3))
                            }
                            else {
                                production.push({assetId: e.extractId, count: parseFloat(parseFloat(e.count/corn_asset.extractTime).toFixed(3))})
                            }
                            window.localStorage.setItem('production', JSON.stringify(production));
                        });
                    }
                }
            }
            else if (crop_type == asset_id + 'carrot'){
                var carrot_asset = cropConfigs.carrot.find(config => config.assetId == asset_id)
                if (typeof carrot_asset !== "undefined"){
                    if (carrot_asset.takes.length > 0){
                        $(carrot_asset.takes).each(function(i, e){
                            //var consumption = JSON.parse(window.localStorage.getItem('consumption')) || [];
                            var cons_item = consumption.find(cons_item => cons_item.assetId == e.assetId)
                            if (cons_item){
                                cons_item.count -= parseFloat(parseFloat(e.count/carrot_asset.extractTime).toFixed(3))
                            }
                            else {
                                consumption.push({assetId: e.assetId, count: parseFloat(parseFloat(e.count/carrot_asset.extractTime).toFixed(3))})
                            }
                            window.localStorage.setItem('consumption', JSON.stringify(consumption));
                        });
                    }

                    if (carrot_asset.gives.length > 0){
                        $(carrot_asset.gives).each(function(i, e){
                            //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                            var prod_item = production.find(prod_item => prod_item.assetId == e.extractId)
                            if (prod_item){
                                prod_item.count -= parseFloat(parseFloat(e.count/carrot_asset.extractTime).toFixed(3))
                            }
                            else {
                                production.push({assetId: e.extractId, count: parseFloat(parseFloat(e.count/carrot_asset.extractTime).toFixed(3))})
                            }
                            window.localStorage.setItem('production', JSON.stringify(production));
                        });
                    }
                }
            }
        }
        else if (wells.includes(asset_id)){
            var well_asset = wellConfigs.find(config => config.assetId == asset_id)
            if (typeof well_asset !== "undefined"){
                if (well_asset.gives.length > 0){
                    $(well_asset.gives).each(function(i, e){
                        //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                        var prod_item = production.find(prod_item => prod_item.assetId == e.extractId)
                        if (prod_item){
                            prod_item.count -= parseFloat(parseFloat(e.count/well_asset.extractTime).toFixed(3))
                        }
                        else {
                            production.push({assetId: e.extractId, count: parseFloat(parseFloat(e.count/well_asset.extractTime).toFixed(3))})
                        }
                        window.localStorage.setItem('production', JSON.stringify(production));
                    });
                }
            }
        }
        else {
            var feed_asset = feedConfigs.find(config => config.assetId == asset_id)
            if (typeof feed_asset !== "undefined"){
                if (feed_asset.takes.other.length > 0){
                    $(feed_asset.takes.other).each(function(i, e){
                        //var consumption = JSON.parse(window.localStorage.getItem('consumption')) || [];
                        var cons_item = consumption.find(cons_item => cons_item.assetId == e.assetId)
                        if (cons_item){
                            cons_item.count -= parseFloat(parseFloat((e.count * 6)/7).toFixed(3))
                        }
                        else {
                            consumption.push({assetId: e.assetId, count: parseFloat(parseFloat((e.count * 6)/7).toFixed(3))})
                        }
                        window.localStorage.setItem('consumption', JSON.stringify(consumption));
                    });
                }
                if (feed_asset.takes.sun.length > 0){
                    $(feed_asset.takes.sun).each(function(i, e){
                        //var consumption = JSON.parse(window.localStorage.getItem('consumption')) || [];
                        var cons_item = consumption.find(cons_item => cons_item.assetId == e.assetId)
                        if (cons_item){
                            cons_item.count -= parseFloat(parseFloat(e.count/7).toFixed(3))
                        }
                        else {
                            consumption.push({assetId: e.assetId, count: parseFloat(parseFloat(e.count/7).toFixed(3))})
                        }
                        window.localStorage.setItem('consumption', JSON.stringify(consumption));
                    });
                }

                if (feed_asset.gives.length > 0){
                    $(feed_asset.gives).each(function(i, e){
                        //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                        var prod_item = production.find(prod_item => prod_item.assetId == e.extractId)
                        if (prod_item){
                            prod_item.count -= parseFloat(parseFloat(e.count / feed_asset.extractTime).toFixed(3))
                        }
                        else {
                            production.push({assetId: e.extractId, count: parseFloat(parseFloat(e.count / feed_asset.extractTime).toFixed(3))})
                        }
                        window.localStorage.setItem('production', JSON.stringify(production));
                    });
                }
            }
        }
        updateSummary();
    }
    else {
        asset_val = 0
        $(this).siblings('.asset_input').text(asset_val)
    }

})

$(document).ready(function(){
  //$('.loadingCont').css('display', 'block')
  getFiats();
  getConfigs();
  getCurrencies();
  getTickers()
  getMarkets();
  getMiningDif()
  showCards();
  updateSummary();
  getCbxTrades()
  getTrxTrades()
  $('.loadingCont').fadeOut(1000);
  /*setInterval(function() {

  }, 300000);*/
});

$('.summary_btn').click(function(){
    if ($('.asset_summary').is(':visible')){
        $('.asset_summary').css('display', 'none')
        $('#summary_down_btn').css('display', 'none')
        $('#summary_up_btn').css('display', 'block')
    }
    else {
        $('.asset_summary').css('display', 'block')
        $('#summary_down_btn').css('display', 'block')
        $('#summary_up_btn').css('display', 'none')
    }
});

var fiat_default
var fiatCurrencies
function getFiats(){
  $.ajax({
    url: "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json",
    context: 'application/json',
    async: false
  }).done(function(data) {
      fiatCurrencies = data
      $.each(data, function(i, e){
        $('#currency_select').append($('<option>', {
            value: i,
            text : i.toUpperCase()
        }));
      });
    });
    if (window.localStorage.hasOwnProperty('fiat_default')){
        fiat_default = window.localStorage.getItem('fiat_default')
        $('#currency_select').val(fiat_default)
        $("#currency_select option[value='" + fiat_default + "']").prop('selected', true);
    }
    else {
        window.localStorage.setItem('fiat_default', 'usd')
        fiat_default = window.localStorage.getItem('fiat_default')
        $('#currency_select').val('usd')
         $("#currency_select option[value='usd']").prop('selected', true);
    }

}

$('#currency_select').change(function(){
    window.localStorage.setItem('fiat_default', $(this).val())
    window.location.reload()
})

