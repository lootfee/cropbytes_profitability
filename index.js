var configs
function getConfigs(){
  $.ajax({
    url: "https://api.cropbytes.com/api/v1/game/launch",
    context: 'application/json',
    async: false
  }).done(function(data) {
      configs = data.data.feedConfigNew
    });
}

var currencies
function getCurrencies(){
  $.ajax({
    url: "https://api.cropbytes.com/api/v2/peatio/public/currencies",
    context: 'application/json',
    async: false
  }).done(function(data) {
      currencies = data
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
  var other_takes = $('<tr><th>Mon-Sat:</th><th></th><th></th></tr>')
  var sun_takes = $('<tr><th>Sun:</th><th></th><th></th></tr>')
  var asset = configs.find(config => config.assetId == assetId)
  var totalPrice = 0
  if (typeof asset !== "undefined"){
    if (asset.takes.other.length > 0){
      $(takes_cont).append('<tr><th>Mon-Sat:</th><th></th></tr>');
      $(asset.takes.other).each(function(i, e){
        $(takes_cont).append('<tr><td style="width: 60px; padding-left: 5px;">' + getAssetName(e.assetId) + '</td><td style="padding: 0 5px 0 5px;">' + e.count +'</td><td> $' + (e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)).toFixed(3) + '</td></tr>')
        totalPrice += parseFloat((e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)).toFixed(3))
      });
    }
    if (asset.takes.sun.length > 0){
      $(takes_cont).append('<tr><th>Sun:</th></tr>');
      $(asset.takes.sun).each(function(i, e){
        $(takes_cont).append('<tr><td style="width: 60px; padding-left: 5px;">' + getAssetName(e.assetId) + '</td><td style="padding:0 5px 0 5px;">' + e.count +'</td><td> $' + (e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)).toFixed(3) + '</td></tr>')
        totalPrice += parseFloat((e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)).toFixed(3))
        console.log('takes', totalPrice)
      });
    }
    return [takes_cont.prop('outerHTML'), totalPrice]
  }
  else {
    return ['', '']
  }
}


function getAssetGives(assetId){
  var gives_cont = $('<table></table>')
  var asset = configs.find(config => config.assetId == assetId)
  var totalPrice = 0
  if (typeof asset !== "undefined"){
    if (asset.gives.length > 0){
      $(asset.gives).each(function(i, e){
        $(gives_cont).append('<tr><td style="width: 60px; padding-left: 5px;">' + getAssetName(e.extractId) + ' / ' + asset.extractTime +' Days</td><td style="padding: 0 5px 0 5px;">' + e.count +'</td><td> $' + (e.count * getUsdPrice(getPrice(e.extractId).market, getPrice(e.extractId).price)).toFixed(3) + '</td></tr>')
        totalPrice += (e.count * getUsdPrice(getPrice(e.extractId).market, getPrice(e.extractId).price)).toFixed(3)
        console.log(totalPrice)
      });
    }
    return [gives_cont.prop('outerHTML'), totalPrice]
  }
  else {
    return ['', '']
  }
}


function showCards(){
  $(currencies).each(function(i, e){
      var card = '<div class="col-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-6">' +
                  '<div class="card" aria-hidden="true">'+
                  ' <img src="' + e.icon_url + '" class="card-img-top" alt="icon">' +
                  ' <div class="card-body"> ' +
                  '  <div><strong> Name: '  + e.name + '</strong></div> ' +
                  '  <div>Market price: ' + getPrice(e.id).price +' ' + getPrice(e.id).market + ' ($' + getUsdPrice(getPrice(e.id).market, getPrice(e.id).price)  + ')</div>' +
                  '    <div class="card-text" style="color: red;"> Takes: </div> ' + getAssetTakes(e.id)[0] +
                  '    <div class="card-text" style="color: blue;"> Gives: </div> ' + getAssetGives(e.id)[0] +
                  '    <div class="card-text" style="color: blue;"> Profit/Week: </div> $' + ((getAssetGives(e.id)[1] * 7) - getAssetTakes(e.id)[1]).toFixed(3).toString() +
                  '</div>' +
                ' </div>' +
                '</div>'
      $('#items-container').append(card)
    });
};


/*function getConfigData(asset_id, currencies) {
  return configs.map(config => currencies.find(currency => config.assetId == asset_id))//.filter(Boolean)
}*/


/*function getCurrencies(){
  $.ajax({
    url: "https://api.cropbytes.com/api/v2/peatio/public/currencies",
    context: 'application/json',
    async: false
  }).done(function(data) {
    $(data).each(function(i, e){
      var card = '<div class="col-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-6">' +
                  '<div class="card" aria-hidden="true">'+
                  ' <img src="' + e.icon_url + '" class="card-img-top" alt="icon">' +
                  ' <div class="card-body"> ' +
                  '  <h5 class="card-title"> Name: '  + e.name + '</h5> ' +
                  '    <p class="card-text"> Takes: ' + getConfigData(e.id, data) +' </p>'
                  '      <span class="placeholder col-7">Takes: </span>' +
                  '      <span class="placeholder col-4"></span> ' +
                  '      <span class="placeholder col-4"></span> ' +
                  '      <span class="placeholder col-6"></span> ' +
                  '    </p> ' +
                  '  <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6"></a> ' +
                  '</div>' +
                ' </div>' +
                '</div>'
      $('#items-container').append(card)
    });
  });
}*/


$(document).ready(function(){
  getConfigs();
  getCurrencies();
  getTickers()
  getMarkets();
  showCards();
  /*setInterval(function() {
    
  }, 300000);*/
})