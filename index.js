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

asset_distribution_count = {
    'pp': 490,
    'ph': 48682,
    'pg': 33617,
    'pc': 33110,
    'egr': 14484,
    'br': 16604,
    'bs': 14295,
    'mud': 14244,
    'dor': 806,
    'zing': 7158,
    'bsh': 6921,
    'hcg': 5595,
    'bb': 7436,
    'pcg': 5968,
    'spky': 400,
    'blb': 244,
    'wg': 148,
    'ort': 5502,
    'at': 46396,
    'bt': 10098,
    'scl': 51634,
    'ocl': 16401,
    'fcl': 1953,
    'sw': 38021,
    'well': 11767,
    'lake': 6705,
    'wtw': 3020,
    'spw': 6062,
    'house': 140,
    'fm': 17
}

var miningDif
var nextEstDiff
var nextl1
var currentWeek
var totalMine
function getMiningDif(){
  $.ajax({
    url: "https://api.cropbytes.com/api/v1/game/assets/mine_stats",
    context: 'application/json',
    async: false
  }).done(function(data) {
      currentWeek = data.data.week
      miningDif = data.data.difficulty
      totalMine = data.data.totalMine
      nextEstDiff = parseFloat((totalMine / est_mining_supply[currentWeek]) ** 5).toFixed(2)
      if ((currentWeek + 1) <= 10 && nextEstDiff <= 1){
        nextEstDiff = 1
      }
      $.each(est_mining_supply, function(i, e){
        calcl1 = parseFloat((totalMine / est_mining_supply[i]) ** 5)
        if (calcl1 <= 1){
            var estWeek = parseInt(i) - 1
            if ((parseInt(i) - 1) <= currentWeek){
                estWeek = parseInt(i) + 1
            }
            if (estWeek <= 10 && calcl1 <= 1){
                calcl1 = 1
              }
            nextl1 = {'week': estWeek, 'difficulty': calcl1.toFixed(2)}
            return false;
        }
      })
      $('#diffInfoCont').append('<strong>Current Diff: ' + miningDif + ' (Week '+ currentWeek + ') <span style="margin-left: 10px;">Next Est. Diff: ' + nextEstDiff + '</span>\n<span style="margin-left: 10px;">Next Est. DL &leq; 1: Week ' + nextl1.week + ' (' + nextl1.difficulty + ')' + '</span></strong>')
    });


}

function getMiningVsExchange(extract_id){
    var market_price = getPrice(extract_id).price
    var extract_conversion_rate = extractsMiningRequirements[extract_id]
    var next_extract_conversion_rate = extractsMiningRequirements[extract_id]
    var weekFloor = Math.ceil(currentWeek / 10) - 1//parseInt(currentWeek / 10, 10) * 10;
    var nextWeekFloor = Math.ceil((currentWeek + 1) / 10) - 1//parseInt((currentWeek + 1) / 10, 10) * 10;
    console.log('weekFloor', weekFloor, nextWeekFloor)
    for (var n = 0; n < weekFloor; n++){
        extract_conversion_rate += parseFloat(parseFloat(extract_conversion_rate * 0.1).toFixed(2))
        console.log('extract_conversion_rate', parseFloat(parseFloat(extract_conversion_rate).toFixed(2)))
    }
    for (var n = 0; n < nextWeekFloor; n++){
        next_extract_conversion_rate += parseFloat(parseFloat(next_extract_conversion_rate * 0.1).toFixed(2))
        console.log('next_extract_conversion_rate', parseFloat(parseFloat(next_extract_conversion_rate).toFixed(2)))
    }
    var mining_return = parseFloat(parseFloat(extract_conversion_rate * miningDif).toFixed(2))
    var exchange_return = parseFloat(parseFloat(1 / market_price).toFixed(2))
    var next_mining_return = parseFloat(parseFloat(next_extract_conversion_rate * nextEstDiff).toFixed(2))
    console.log('nest_est_mining_change', mining_return, next_mining_return)
    var nest_est_mining_change = {'mining': parseFloat(parseFloat(((mining_return - next_mining_return) / mining_return) * 100).toFixed(2)),
                                  'exchange': parseFloat(parseFloat(((exchange_return - next_mining_return) / exchange_return) * 100).toFixed(2))}
    var est_dl1_price = parseFloat(parseFloat((exchange_return * market_price) / extract_conversion_rate).toFixed(2))
    return {'mining_return': mining_return, 'exchange_return': exchange_return, 'next_mining_return': next_mining_return,
    'est_dl1_price': est_dl1_price, 'extract_conversion_rate': parseFloat(parseFloat(extract_conversion_rate).toFixed(2)),
    'nest_est_mining_change': nest_est_mining_change}
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
var today = new Date()
var marketVolume = {}
function getMarketVolume(){
    var unix7day = ~~(+new Date(new Date().setDate(today.getDate() - 7))/1000);
    var unix30day = ~~(+new Date(new Date().setDate(today.getDate() - 30))/1000);

    $(markets).each(function(i, e){
        marketVolume[e.base_unit] = {'marketBuy7': 0, 'marketSell7': 0, 'marketBuy30': 0, 'marketSell30': 0}
        $.ajax({
            url: "https://api.cropbytes.com/api/v2/peatio/public/markets/" + e.id +"/trades",
            context: 'application/json',
            async: false
          }).done(function(data) {
            $(data).each(function(i2, e2){
                if (e2.created_at >= unix30day){
                    if (e2.created_at >= unix7day){
                        if (e2.taker_type === 'sell'){
                            marketVolume[e.base_unit]['marketSell7'] += e2.amount
                        }
                        else if (e2.taker_type === 'buy'){
                            marketVolume[e.base_unit]['marketBuy7'] += e2.amount
                        }
                    }
                    if (e2.taker_type === 'sell'){
                        marketVolume[e.base_unit]['marketSell30'] += e2.amount
                    }
                    else if (e2.taker_type === 'buy'){
                        marketVolume[e.base_unit]['marketBuy30'] += e2.amount
                    }
                }
            })
          });
        var contName = '.' + e.base_unit + 'VolumeCont'
        $(contName).empty();
        $(contName).removeClass('volumeCont')
        $(contName).append('<div class="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 px-1">Last 100 trades:</div>' +
                      '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: blue;">7 Day buys: </div><div style="margin-left: 5px;">' + parseInt(marketVolume[e.base_unit]['marketBuy7']) +  ' ' + e.base_unit + '</div></div>' +
                      '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: red;">7 Day sells: </div><div style="margin-left: 5px;">' + parseInt(marketVolume[e.base_unit]['marketSell7']) +  ' ' + e.base_unit + '</div></div>' +
                      '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: blue;">30 Day buys: </div><div style="margin-left: 5px;">' + parseInt(marketVolume[e.base_unit]['marketBuy30']) +  ' ' + e.base_unit + '</div></div>' +
                      '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: red;">30 Day sells: </div><div style="margin-left: 5px;">' + parseInt(marketVolume[e.base_unit]['marketSell30']) +  ' ' + e.base_unit + '</div></div>' )

         $('.volumeCont').empty()
    })
}



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

  $.each(consumptionTradesDict, function(i, e){
    var dataDate = new Date((i)*1000)

    consumptionTradesArr.push({ time: {year: dataDate.getFullYear(), month: dataDate.getMonth() + 1, day: dataDate.getDate()}, value: e })
  });

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
    //console.log('getTrades', getTrades)
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
      //console.log('fiat_default', getFiatDefault())
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
      var mcap_div = ''
      var market_cap = 0
      if (asset_distribution_count[e.id]){
        var market_cap_ = parseFloat(asset_distribution_count[e.id] * usd_price).toFixed(0)
        market_cap = market_cap_
        var market_cap_str = market_cap_.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var circ_supply = asset_distribution_count[e.id].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        mcap_div = '<div class="row">' +
                   '<div class="col-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">Circulating supply: ' + circ_supply + ' ' + e.id.toUpperCase() + ' </div>' +
                   '<div class="col-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">Market Cap: ' + market_cap_str + ' USD</div>' +
                   '</div>'
      }
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

      var item_qty = 0
      if (cropLands.includes(e.id)){
        item_qty = window.localStorage.getItem(e.cloneId) || 0;
      }
      else {
        item_qty = window.localStorage.getItem(e.id) || 0;
      }
      var mining_v_exchange = getMiningVsExchange(e.id)
      var mining_return_color = {}
      /*if (mining_v_exchange.mining_return > mining_v_exchange.exchange_return){
        mining_return_color = {'mining': 'red', 'exchange': 'blue'}
      }
      else {
        mining_return_color = {'mining': 'blue', 'exchange': 'red'}
      }*/
      var bsmStatus
      if (mining_v_exchange.mining_return <= mining_v_exchange.exchange_return){
        bsmStatus = {'status': 'Mine', 'color': 'green'}
      }
      else if (mining_v_exchange.extract_conversion_rate > mining_v_exchange.exchange_return){
        bsmStatus = {'status': 'Sell', 'color': 'red'}
      }
      else if (mining_v_exchange.exchange_return < mining_v_exchange.mining_return){
        bsmStatus = {'status': 'Buy', 'color': 'blue'}
      }

      var volumeDiv = '    <div class="row volumeCont ' + e.id + 'VolumeCont" style="margin-top: 10px;"> ' +
                    '        <div class="d-flex justify-content-center">' +
                    '         <div class="spinner-border spinner-border-sm">' +
                    '            <span class="visually-hidden">Loading...</span>' +
                    '         </div>' +
                    '        </div>' +
                    '    </div>'

      var card_body
      var roi = getRoi(usd_price, daily_profit)
      if (extracts.includes(e.id)){
        card_body = '    <div class="row" style="margin-top: 5px;">' +
                  '         <div class="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 px-1">Conversion rate: ' + mining_v_exchange.extract_conversion_rate + ' ' + e.id + '/ 1 cbx (' + parseFloat(1/mining_v_exchange.extract_conversion_rate).toFixed(2) + ' cbx)</div>' +
                  '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: red;">Mining conversion: </div> ' + parseFloat(mining_v_exchange.mining_return).toFixed(2) + ' ' + e.id +  '/ 1 cbx</div>' +
                  '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: blue;">Exchange conversion: </div>' + parseFloat(mining_v_exchange.exchange_return).toFixed(2) + ' ' + e.id + '/ 1 cbx</div>' +
                  //'         <div class="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 px-1" style="margin-top: 5px;">Est. DL 1 price: <span style="color: ' + bsmStatus.color + ';"> ' + mining_v_exchange.est_dl1_price.toFixed(3) +  ' cbx</span></div>' +
                  '         <div class="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 px-1">Status: <span style="color: ' + bsmStatus.color + ';"> ' + bsmStatus.status +  '</span></div>' +
                  '         <div class="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 px-1"> Est. next mining conversion: ' + parseFloat(mining_v_exchange.next_mining_return).toFixed(2) + ' ' + e.id + '/ 1 cbx (' + parseFloat(1/mining_v_exchange.next_mining_return).toFixed(2) + ' cbx)<span style="color: red;">(' + mining_v_exchange.nest_est_mining_change.mining.toFixed(0) + '%)</span><span style="color: blue;">(' + mining_v_exchange.nest_est_mining_change.exchange.toFixed(0) + '%)</span></div>' +
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
                  '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: blue;">ROI: </div>' + roi + ' days</div>' +
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
    //console.log('asset_gives', e.id, getAssetGives(e.id)[3], getFruitGives(e.id)[3], getWellGives(e.id)[3], getCropGives(e.id, e.cloneId)[3], asset_gives)

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
      //console.log('asset_takes', e.id, getAssetTakes(e.id)[2], getFruitTakes(e.id)[2], getCropTakes(e.id, e.cloneId)[2], asset_takes)
      var production_id = asset_gives
      var consumption_ids = asset_takes

      var card = '<div class="col-6 col-xl-2 col-lg-2 col-md-2 col-sm-6 col-xs-6 asset_card" data-asset_name="' + e.name + '" data-asset_price="' + usd_price+ '" data-daily_profit="' + daily_profit + '" data-roi="' + roi + '" data-market_cap="' + market_cap + '" data-circulating_supply="' + asset_distribution_count[e.id] + '">' +
                  '<div class="card" aria-hidden="true">'+
                  ' <img src="' + e.icon_url + '" class="card-img-top" alt="icon">' +
                  ' <div class="card-body"> ' +
                  '  <div style="font-size: 12px;"><strong>'  + e.name + '</strong></div> ' +
                  '  <div class="input-group mb-3">' +
                  '    <button class="btn btn-primary btn-sm minus_btn" type="button" id="minus_' + e.id + '_btn">-</button>' +
                  //  '    <span type="number" class="form-control text-center asset_input" data-crop_type="' + e.cloneId + '" data-asset_id="' + e.id + '" id="asset_' + e.id + '_qty">' + item_qty + '</span>' +
                  '    <input type="number" class="form-control text-center asset_input" data-crop_type="' + e.cloneId + '" data-asset_id="' + e.id + '" id="asset_' + e.id + '_qty" value="' + item_qty + '">' +
                  '    <button class="btn btn-primary btn-sm add_btn" type="button" id="plus_' + e.id + '_btn">+</button>' +
                  '  </div>' +
                  '  <div>' + item_market_price.type + ' price: ' + item_market_price.price +' ' + item_market_price.market + ' (' + parseFloat(usd_price).toFixed(2)  + ' ' + fiat_default.toUpperCase() +  ') <button class="btn btn-info btn-sm" data-bs-toggle="modal" data-bs-target="#chartsModal" data-bs-asset_id="'+ e.id +'" data-bs-market="' + item_market_price.market + '" data-bs-production_id="' + production_id + '" data-bs-production_count="' + asset_gives_count + '" data-bs-consumption_ids="' + consumption_ids + '" data-bs-consumption_counts="' + asset_takes_count + '" style="padding:0;"><i class="bi bi-graph-up"></i></button></div>' +
                  ' ' + mcap_div +
                  ' ' + volumeDiv +
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
    $('.asset_summary').css('display', 'none');
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
            $('#production-container').append('<div class="asset_summary"><span>' + getAssetName(e.assetId) + ' = </span><span> ' + parseFloat(e.count).toFixed(3) + ' </span><span> (' + (parseFloat(e.count) * usd_price).toFixed(3) + ' ' + fiat_default.toUpperCase() +  ')</span></div>')
        }
    })
    var consumption = JSON.parse(window.localStorage.getItem('consumption'))
    $.each(consumption, function(i, e){
        var item_market_price = getPrice(e.assetId)
        var usd_price = getUsdPrice(item_market_price.market, item_market_price.price)
        total_consumption += parseFloat(e.count) * parseFloat(usd_price)
        if (e.count > 0.0001){
            $('#consumption-container').append('<div class="asset_summary"><span>' + getAssetName(e.assetId) + ' = </span><span> ' + parseFloat(e.count).toFixed(3) + ' </span><span> (' + (parseFloat(e.count) * parseFloat(usd_price)).toFixed(3) + ' ' + fiat_default.toUpperCase() +  ')</span></div>')
        }
    })

    var daily_profit = parseFloat(parseFloat(total_production) - parseFloat(total_consumption))
    $('#tdp').text(' ' + total_production.toFixed(2) + ' ' + fiat_default.toUpperCase())
    $('#tdc').text(' ' + total_consumption.toFixed(2) + ' ' + fiat_default.toUpperCase() )
    $('#ta').text(' ' + total_assets.toFixed(2) + ' ' + fiat_default.toUpperCase() )
    $('#daily-profit').text(' ' + daily_profit.toFixed(3) + ' ' + fiat_default.toUpperCase() )
    $('#weekly-profit').text(' ' + (daily_profit * 7).toFixed(2) + ' ' + fiat_default.toUpperCase() )
    $('#monthly-profit').text(' ' + (daily_profit * 30).toFixed(2) + ' ' + fiat_default.toUpperCase() )
}



$(document).on('click', '.add_btn', function () {
    var asset_val = parseInt($(this).siblings('.asset_input').val()) || 0;
    var asset_id = $(this).siblings('.asset_input').data('asset_id');
    var crop_type = $(this).siblings('.asset_input').data('crop_type');
    asset_val += 1
    $(this).siblings('.asset_input').val(asset_val)

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
    var asset_val = parseInt($(this).siblings('.asset_input').val()) || 0;
    var asset_id = $(this).siblings('.asset_input').data('asset_id');
    var crop_type = $(this).siblings('.asset_input').data('crop_type');
    asset_val -= 1
    if (asset_val > -1){
        $(this).siblings('.asset_input').val(asset_val)
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
        $(this).siblings('.asset_input').val(asset_val)
    }

})


$(document).on('change', '.asset_input', function () {
    var asset_val = parseInt($(this).val()) || 0;
    var asset_id = $(this).data('asset_id');
    var crop_type = $(this).data('crop_type');

    if (asset_val > -1){
        $(this).val(asset_val)
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
                            cons_item.count = parseFloat(asset_val * parseFloat(e.count/fruit_asset.extractTime).toFixed(3))
                        }
                        else {
                            consumption.push({assetId: e.assetId, count: parseFloat(asset_val * parseFloat(e.count/fruit_asset.extractTime).toFixed(3))})
                        }
                        window.localStorage.setItem('consumption', JSON.stringify(consumption));
                    });
                }

                if (fruit_asset.gives.length > 0){
                    $(fruit_asset.gives).each(function(i, e){
                        //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                        var prod_item = production.find(prod_item => prod_item.assetId == 'frf')
                        if (prod_item){
                            prod_item.count = parseFloat(asset_val * parseFloat(e.count/fruit_asset.extractTime).toFixed(3))
                        }
                        else {
                            production.push({assetId: 'frf', count: parseFloat(asset_val * parseFloat(e.count/fruit_asset.extractTime).toFixed(3))})
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
                                cons_item.count = parseFloat(asset_val * parseFloat(e.count/corn_asset.extractTime).toFixed(3))
                            }
                            else {
                                consumption.push({assetId: e.assetId, count: parseFloat(asset_val * parseFloat(e.count/corn_asset.extractTime).toFixed(3))})
                            }
                            window.localStorage.setItem('consumption', JSON.stringify(consumption));
                        });
                    }

                    if (corn_asset.gives.length > 0){
                        $(corn_asset.gives).each(function(i, e){
                            //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                            var prod_item = production.find(prod_item => prod_item.assetId == e.extractId)
                            if (prod_item){
                                prod_item.count = parseFloat(asset_val * parseFloat(e.count/corn_asset.extractTime).toFixed(3))
                            }
                            else {
                                production.push({assetId: e.extractId, count: parseFloat(asset_val * parseFloat(e.count/corn_asset.extractTime).toFixed(3))})
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
                                cons_item.count = parseFloat(asset_val * parseFloat(e.count/carrot_asset.extractTime).toFixed(3))
                            }
                            else {
                                consumption.push({assetId: e.assetId, count: parseFloat(asset_val * parseFloat(e.count/carrot_asset.extractTime).toFixed(3))})
                            }
                            window.localStorage.setItem('consumption', JSON.stringify(consumption));
                        });
                    }

                    if (carrot_asset.gives.length > 0){
                        $(carrot_asset.gives).each(function(i, e){
                            //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                            var prod_item = production.find(prod_item => prod_item.assetId == e.extractId)
                            if (prod_item){
                                prod_item.count = parseFloat(asset_val * parseFloat(e.count/carrot_asset.extractTime).toFixed(3))
                            }
                            else {
                                production.push({assetId: e.extractId, count: parseFloat(asset_val * parseFloat(e.count/carrot_asset.extractTime).toFixed(3))})
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
                            prod_item.count = parseFloat(asset_val * parseFloat(e.count/well_asset.extractTime).toFixed(3))
                        }
                        else {
                            production.push({assetId: e.extractId, count: parseFloat(asset_val * parseFloat(e.count/well_asset.extractTime).toFixed(3))})
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
                            cons_item.count = parseFloat(asset_val * parseFloat((e.count * 6)/7).toFixed(3))
                        }
                        else {
                            consumption.push({assetId: e.assetId, count: parseFloat(asset_val * parseFloat((e.count * 6)/7).toFixed(3))})
                        }
                        window.localStorage.setItem('consumption', JSON.stringify(consumption));
                    });
                }
                if (feed_asset.takes.sun.length > 0){
                    $(feed_asset.takes.sun).each(function(i, e){
                        //var consumption = JSON.parse(window.localStorage.getItem('consumption')) || [];
                        var cons_item = consumption.find(cons_item => cons_item.assetId == e.assetId)
                        if (cons_item){
                            cons_item.count = parseFloat(asset_val * parseFloat(e.count/7).toFixed(3))
                        }
                        else {
                            consumption.push({assetId: e.assetId, count: parseFloat(asset_val * parseFloat(e.count/7).toFixed(3))})
                        }
                        window.localStorage.setItem('consumption', JSON.stringify(consumption));
                    });
                }

                if (feed_asset.gives.length > 0){
                    $(feed_asset.gives).each(function(i, e){
                        //var production = JSON.parse(window.localStorage.getItem('production')) || [];
                        var prod_item = production.find(prod_item => prod_item.assetId == e.extractId)
                        if (prod_item){
                            prod_item.count = parseFloat(asset_val * parseFloat(e.count / feed_asset.extractTime).toFixed(3))
                        }
                        else {
                            production.push({assetId: e.extractId, count: parseFloat(asset_val * parseFloat(e.count / feed_asset.extractTime).toFixed(3))})
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
        $(this).val(asset_val)
    }

})


var totalTime = 0
function timeFunction(f){
    var startTime = performance.now()
    f()
    var endTime = performance.now()
    totalTime += (endTime - startTime) / 1000
    console.log(`${f.name} - ${(endTime - startTime) / 1000} seconds`)
}

$(document).ready(function(){
  if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
          console.log('Service Worker is registered', registration);
        })
        .catch(err => {
          console.error('Registration failed:', err);
        });
      });
    }
  //$('.loadingCont').css('display', 'block')
  timeFunction(getFiats)
  //getFiats();
  timeFunction(getConfigs)
  //getConfigs();
  timeFunction(getCurrencies)
  //getCurrencies();
  timeFunction(getTickers)
  //getTickers()
  timeFunction(getMarkets)
  //getMarkets();
  timeFunction(getMiningDif)
  //getMiningDif()
  timeFunction(showCards)
  //showCards();
  timeFunction(updateSummary)
  //updateSummary();
  $('.loadingCont').fadeOut(1000);
  console.log('total time', totalTime)

  $(document).ready(function(){
        timeFunction(getCbxTrades)
        //getCbxTrades()
        timeFunction(getTrxTrades)
        //getTrxTrades()
        timeFunction(getMarketVolume)
        //getMarketVolume();
        console.log('total time', totalTime)

        if ($('#sort_select').val() == 'name'){
            sortName()
        }
        else if ($('#sort_select').val() == 'price'){
            sortPrice()
        }
        else if ($('#sort_select').val() == 'profit'){
            sortProfit()
        }
        else if ($('#sort_select').val() == 'roi'){
            sortRoi()
        }
        else if ($(this).val() === 'market_cap'){
            sortMarketCap()
        }
        else if ($(this).val() === 'circulating_supply'){
            sortCircSupply()
        }


    });
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


function sortName(){
    var sortArr = []
    $('.asset_card').each(function(i, e){
        sortArr.push([$(e).data('asset_name'), e])
    })
    sortArr.sort(function(x, y){
        if(x[0] < y[0]) { return -1; }
        if(x[0] > y[0]) { return 1; }
        return 0;
    })

    $(sortArr).each(function(i, e){
        $('#items-container').append(e[1])
    })
}

function sortPrice(){
    var sortArr = []
    $('.asset_card').each(function(i, e){
        sortArr.push([$(e).data('asset_price'), e])
    })
    sortArr.sort(function(x, y) {
    return y[0] - x[0];
    });

    $(sortArr).each(function(i, e){
        $('#items-container').append(e[1])
    })
}

function sortProfit(){
    var sortArr = []
    $('.asset_card').each(function(i, e){
        sortArr.push([$(e).data('daily_profit'), e])
    })
    sortArr.sort(function(x, y) {
        return y[0] - x[0];
    });

    $(sortArr).each(function(i, e){
        $('#items-container').append(e[1])
    })
}


function sortRoi(){
    var sortArr = []
    $('.asset_card').each(function(i, e){
        var roi_data = $(e).data('roi')
        if (roi_data <= 0){
            roi_data = 100000
        }
        sortArr.push([roi_data, e])
    })
    sortArr.sort(function(x, y) {
        return x[0] - y[0];
    });

    $(sortArr).each(function(i, e){
        $('#items-container').append(e[1])
    })
}

function sortMarketCap(){
    var sortArr = []
    $('.asset_card').each(function(i, e){
        sortArr.push([$(e).data('market_cap'), e])
    })
    sortArr.sort(function(x, y) {
        return y[0] - x[0];
    });

    $(sortArr).each(function(i, e){
        $('#items-container').append(e[1])
    })
}

function sortCircSupply(){
    var sortArr = []
    $('.asset_card').each(function(i, e){
        sortArr.push([$(e).data('circulating_supply'), e])
    })
    sortArr.sort(function(x, y) {
        return y[0] - x[0];
    });

    $(sortArr).each(function(i, e){
        $('#items-container').append(e[1])
    })
}

$('#sort_select').change(function(){
    if ($(this).val() === 'name'){
        sortName()
    }
    else if ($(this).val() === 'price'){
        sortPrice()
    }
    else if ($(this).val() === 'profit'){
        sortProfit()
    }
    else if ($(this).val() === 'roi'){
        sortRoi()
    }
    else if ($(this).val() === 'market_cap'){
        sortMarketCap()
    }
    else if ($(this).val() === 'circulating_supply'){
        sortCircSupply()
    }
})