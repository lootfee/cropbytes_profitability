var wells = ['sw', 'well', 'lake']
var cropLands = ['scl', 'ocl', 'fcl']
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
    $(obj).each(function (i, e) {
      keys.push(e.name)
    })

    keys.sort();
    return keys;
}

var currencies = []
function getCurrencies(){
  $.ajax({
    url: "https://api.cropbytes.com/api/v2/peatio/public/currencies",
    context: 'application/json',
    async: false
  }).done(function(data) {
    var keys = getObjectKeysAlphabetical(data)
    //i = 0, key = null, val = null;
    $(keys).each(function (i, e) {
      console.log(e)
      var asset = data.find(currency => currency.name == e)
      currencies.push(asset)
    })
    console.log(currencies)
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

function getAssetName(assetId){
  var asset = currencies.find(currency => currency.id == assetId)
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
    return {'price': tickers[market].ticker.last, 'market': asset.quote_unit}
  }
  else {
    return {'price': '', 'market': ''}
  }

}

function getUsdPrice(market, price){
  if (typeof market !== "undefined" || typeof price !== "undefined"){
    if (market == 'usdt'){
      return price
    }
    else {
      var marketUsdPrice = getPrice(market).price
      var usd_price = (parseFloat(marketUsdPrice) * parseFloat(price)).toFixed(3)
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

function getAssetTakes(assetId){
  var takes_cont = $('<table></table>')
  var asset = feedConfigs.find(config => config.assetId == assetId)
  var totalPrice = 0
  if (typeof asset !== "undefined"){
    if (asset.takes.other.length > 0){
      $(takes_cont).append('<tr><th colspan="3">Mon-Sat:</th></tr>');
      $(asset.takes.other).each(function(i, e){
        $(takes_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.assetId) + '</td><td style="padding-left: 5px;"> $' + (e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)).toFixed(3) + '</td></tr>')
        totalPrice += (6 * parseFloat((e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)).toFixed(3)))
      });
    }
    if (asset.takes.sun.length > 0){
      $(takes_cont).append('<tr><th colspan="3">Sun:</th></tr>');
      $(asset.takes.sun).each(function(i, e){
        $(takes_cont).append('<tr><td style="padding:0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.assetId) + '</td><td style="padding-left: 5px;"> $' + (e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)).toFixed(3) + '</td></tr>')
        totalPrice += parseFloat((e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)).toFixed(3))
        //console.log('takes', totalPrice)
      });
    }
    return [takes_cont.prop('outerHTML'), totalPrice]
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
  if (typeof asset !== "undefined"){
    extractTime = asset.extractTime
    if (asset.gives.length > 0){
      $(asset.gives).each(function(i, e){
        $(gives_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.extractId) + '</td><td style="padding-left: 5px;"> $' + (e.count * getUsdPrice(getPrice(e.extractId).market, getPrice(e.extractId).price)).toFixed(3) + '</td></tr>')
        totalPrice += (e.count * getUsdPrice(getPrice(e.extractId).market, getPrice(e.extractId).price)).toFixed(3)
        //console.log(totalPrice)
      });
    }
    return [gives_cont.prop('outerHTML'), totalPrice, extractTime]
  }
  else {
    return ['', 0, 0]
  }
}

function getFruitTakes(assetId){
  var takes_cont = $('<table></table>')
  var asset = fruitConfigs.find(config => config.assetId == assetId)
  var totalPrice = 0
  if (typeof asset !== "undefined"){
    if (asset.takes.length > 0){
      //$(takes_cont).append('<tr><th>Mon-Sat:</th><th></th></tr>');
      $(asset.takes).each(function(i, e){
        $(takes_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.assetId) + '</td><td style="padding-left: 5px;"> $' + (e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)).toFixed(3) + '</td></tr>')
        //$(takes_cont).append('<tr><td colspan="3">Grinding fee: 0.01 trx/crop</td></tr>')
        totalPrice += (parseFloat((0.01 * e.count) * getUsdPrice('usdt', getPrice('trx').price)) + parseFloat((e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)))).toFixed(3)
      });
    }
    return [takes_cont.prop('outerHTML'), totalPrice]
  }
  else {
    return ['', 0]
  }
}

function getFruitGives(assetId){
  var gives_cont = $('<table></table>')
  var asset = fruitConfigs.find(config => config.assetId == assetId)
  //console.log('fruit', asset)
  var totalPrice = 0
  var extractTime = 0
  if (typeof asset !== "undefined"){
    extractTime = asset.extractTime
    if (asset.gives.length > 0){
      $(asset.gives).each(function(i, e){
        $(gives_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.extractId) + '</td><td style="padding-left: 5px;"> $' + (e.count * getUsdPrice(getPrice('frf').market, getPrice('frf').price)).toFixed(3) + '</td></tr>')
        totalPrice += parseFloat(e.count * getUsdPrice(getPrice('frf').market, getPrice('frf').price)).toFixed(3)
        //console.log(totalPrice, extractTime)
      });
    }
    return [gives_cont.prop('outerHTML'), totalPrice, extractTime]
  }
  else {
    return ['', 0, 0]
  }
}


function showCards(){
  $(currencies).each(function(i, e){
      var daily_profit
      var harvestTime
      //console.log(e.id, getAssetTakes(e.id)[1], getAssetGives(e.id)[2])
      //console.log(e.id, getFruitGives(e.id)[1], getFruitTakes(e.id)[1], getFruitGives(e.id)[2])
      if (fruits.includes(e.id)){
          harvestTime = getFruitGives(e.id)[2]
          daily_profit = ((getFruitGives(e.id)[1] - getFruitTakes(e.id)[1]) / getFruitGives(e.id)[2]).toFixed(3).toString()
        }
      else {
        if (getAssetGives(e.id)[2] > 0){
          harvestTime = getAssetGives(e.id)[2]
          daily_profit = (getAssetGives(e.id)[1] - (getAssetTakes(e.id)[1] / 7)).toFixed(3).toString()
        }
        else {
          daily_profit = 0
          harvestTime = 0
        }
      }
      /*if (getAssetGives(e.id)[2] > 0){
        harvestTime = getAssetGives(e.id)[2]
        daily_profit = (getAssetGives(e.id)[1] - (getAssetTakes(e.id)[1] / 7)).toFixed(3).toString()
      }
      else if (getFruitGives(e.id)[2] > 0){
        harvestTime = getFruitGives(e.id)[2]
        daily_profit = ((getFruitGives(e.id)[1] - getFruitTakes(e.id)[1]) / getFruitGives(e.id)[2]).toFixed(3).toString()
      }
      else {
        daily_profit = 0
        harvestTime = 0
      }*/

      var card = '<div class="col-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-6">' +
                  '<div class="card" aria-hidden="true">'+
                  ' <img src="' + e.icon_url + '" class="card-img-top" alt="icon">' +
                  ' <div class="card-body"> ' +
                  '  <div><strong> Name: '  + e.name + '</strong></div> ' +
                  '  <div class="input-group mb-3">' +
                  '    <button class="btn btn-primary minus_btn" type="button" id="minus_' + e.id + '_btn">-</button>' +
                  '    <span class="form-control text-center asset_input" data-asset_id="' + e.id + '" id="asset_' + e.id + '_qty">0</span>' +
                  '    <button class="btn btn-primary add_btn" type="button" id="plus_' + e.id + '_btn">+</button>' +
                  '  </div>' +
                  '  <div>Market price: ' + getPrice(e.id).price +' ' + getPrice(e.id).market + ' ($' + getUsdPrice(getPrice(e.id).market, getPrice(e.id).price)  + ')</div>' +
                  '    <div class="card-text" style="color: red;"> Takes: </div> ' + getAssetTakes(e.id)[0] + getFruitTakes(e.id)[0] +
                  '    <div class="card-text" style="color: blue;"> Gives: </div> ' + getAssetGives(e.id)[0] + getFruitGives(e.id)[0] +
                  '    <div class="card-text" style="color: blue;"> Harvest time: </div> ' + harvestTime + ' days' +
                  '    <div class="card-text" style="color: blue;"> Daily Profit: </div> $' + daily_profit +
                  '</div>' +
                ' </div>' +
                '</div>'
      $('#items-container').append(card)
    });
};

$(document).on('click', '.add_btn', function () {
  var asset_val = parseInt($(this).siblings('.asset_input').text());
  var asset_id = $(this).siblings('.asset_input').data('asset_id');
  asset_val += 1
  $(this).siblings('.asset_input').text(asset_val)
  window.localStorage.setItem(asset_id, asset_val);
});

$(document).on('click', '.minus_btn', function () {
  var asset_val = parseInt($(this).siblings('.asset_input').text());
  var asset_id = $(this).siblings('.asset_input').data('asset_id');
  asset_val -= 1
  $(this).siblings('.asset_input').text(asset_val)
  window.localStorage.setItem(asset_id, asset_val);
})



$(document).ready(function(){
  getConfigs();
  getCurrencies();
  getTickers()
  getMarkets();
  showCards();
  /*setInterval(function() {

  }, 300000);*/
})
