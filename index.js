var wells = ['sw', 'well', 'lake']
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
      console.log('cropconfig', data.data.cropConfig)
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

function getRoi(price, profit){
    var roi = Math.floor(parseFloat(price)/parseFloat(profit))
    console.log('profit', parseFloat(profit))
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
  if (typeof asset !== "undefined"){
    if (asset.takes.other.length > 0){
      $(takes_cont).append('<tr><th colspan="3">Mon-Sat:</th></tr>');
      $(asset.takes.other).each(function(i, e){
        $(takes_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.assetId) + '</td><td style="padding-left: 5px;"> $' + (e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)).toFixed(3) + '</td></tr>')
        totalPrice += (6 * (parseFloat(e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price))))
      });
    }
    if (asset.takes.sun.length > 0){
      $(takes_cont).append('<tr><th colspan="3">Sun:</th></tr>');
      $(asset.takes.sun).each(function(i, e){
        $(takes_cont).append('<tr><td style="padding:0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.assetId) + '</td><td style="padding-left: 5px;"> $' + (e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)).toFixed(3) + '</td></tr>')
        totalPrice += parseFloat(e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price))
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
        totalPrice += (e.count * getUsdPrice(getPrice(e.extractId).market, getPrice(e.extractId).price))
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
        totalPrice += parseFloat((e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)))
        //(parseFloat((0.01 * e.count) * getUsdPrice('usdt', getPrice('trx').price)) - if include grinding fee
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
  var totalPrice = 0
  var extractTime = 0
  if (typeof asset !== "undefined"){
    extractTime = asset.extractTime
    if (asset.gives.length > 0){
      $(asset.gives).each(function(i, e){
        $(gives_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.extractId) + '</td><td style="padding-left: 5px;"> $' + (e.count * getUsdPrice(getPrice('frf').market, getPrice('frf').price)).toFixed(3) + '</td></tr>')
        totalPrice += parseFloat(e.count * getUsdPrice(getPrice('frf').market, getPrice('frf').price))
      });
    }
    return [gives_cont.prop('outerHTML'), totalPrice, extractTime]
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
  if (typeof asset !== "undefined"){
    extractTime = Math.round((asset.extractTime + Number.EPSILON) * 100) / 100
    if (asset.gives.length > 0){
      $(asset.gives).each(function(i, e){
        $(gives_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.extractId) + '</td><td style="padding-left: 5px;"> $' + (e.count * getUsdPrice(getPrice(e.extractId).market, getPrice(e.extractId).price)).toFixed(3) + '</td></tr>')
        totalPrice += parseFloat(e.count * getUsdPrice(getPrice(e.extractId).market, getPrice(e.extractId).price))
      });
    }
    return [gives_cont.prop('outerHTML'), totalPrice, extractTime]
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
  if (typeof asset !== "undefined"){
    if (asset.takes.length > 0){
      //$(takes_cont).append('<tr><th>Mon-Sat:</th><th></th></tr>');
      $(asset.takes).each(function(i, e){
        $(takes_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.assetId) + '</td><td style="padding-left: 5px;"> $' + (e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)).toFixed(3) + '</td></tr>')
        //$(takes_cont).append('<tr><td colspan="3">Grinding fee: 0.01 trx/crop</td></tr>')
        totalPrice += parseFloat((e.count * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)))
        // (parseFloat((grindingFee * e.count) * getUsdPrice('usdt', getPrice('trx').price)) if include grinding fee
      });
    }
    return [takes_cont.prop('outerHTML'), totalPrice]
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
  if (typeof asset !== "undefined"){
    extractTime = asset.extractTime
    if (asset.gives.length > 0){
      $(asset.gives).each(function(i, e){
        $(gives_cont).append('<tr><td style="padding: 0 5px 0 5px;" colspan="2">' + e.count + ' ' + getAssetName(e.extractId) + '</td><td style="padding-left: 5px;"> $' + (e.count * getUsdPrice(getPrice(e.extractId).market, getPrice(e.extractId).price)).toFixed(3) + '</td></tr>')
        totalPrice += parseFloat(e.count * getUsdPrice(getPrice(e.extractId).market, getPrice(e.extractId).price))
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
          daily_profit = ((getFruitGives(e.id)[1] - getFruitTakes(e.id)[1]) / getFruitGives(e.id)[2])
        }
      else if (wells.includes(e.id)){
          harvestTime = (getWellGives(e.id)[2])
          daily_profit = (getWellGives(e.id)[1] / getWellGives(e.id)[2])
      }
      else if (cropLands.includes(e.id)){
          //console.log(getCropGives(e.id, e.cloneId)[1], getCropTakes(e.id, e.cloneId)[1], getCropGives(e.id, e.cloneId)[2])
          harvestTime = (getCropGives(e.id, e.cloneId)[2])
          daily_profit = (getCropGives(e.id, e.cloneId)[1] - getCropTakes(e.id, e.cloneId)[1]) / getCropGives(e.id, e.cloneId)[2]

      }
      else {
        if (getAssetGives(e.id)[2] > 0){
          harvestTime = getAssetGives(e.id)[2]
          daily_profit = (getAssetGives(e.id)[1] - (getAssetTakes(e.id)[1] / 7))
        }
        else {
          daily_profit = 0
          harvestTime = 0
        }
      }

      var item_qty
      if (cropLands.includes(e.id)){
        item_qty = window.localStorage.getItem(e.cloneId) || 0;
      }
      else {
        item_qty = window.localStorage.getItem(e.id) || 0;
      }
      //var item_qty = window.localStorage.getItem(e.id) || 0;
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
                  '  <div>' + getPrice(e.id).type + ' price: ' + getPrice(e.id).price +' ' + getPrice(e.id).market + ' ($' + getUsdPrice(getPrice(e.id).market, getPrice(e.id).price)  + ')</div>' +
                  '    <div class="card-text" style="color: red;"> Takes: </div> ' + getAssetTakes(e.id)[0] + getFruitTakes(e.id)[0] + getCropTakes(e.id, e.cloneId)[0] +
                  '    <div class="card-text" style="color: blue;"> Gives: </div> ' + getAssetGives(e.id)[0] + getFruitGives(e.id)[0] + getWellGives(e.id)[0] + getCropGives(e.id, e.cloneId)[0] +
                  '    <div class="card-text" style="color: blue;"> Harvest time: </div> ' + harvestTime + ' days' +
                  '    <div class="row">' +
                  '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: blue;">Daily Profit: </div> $' + daily_profit.toFixed(3) + '</div>' +
                  '         <div class="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 px-1"> <div style="color: blue;">ROI: </div>' + getRoi(getUsdPrice(getPrice(e.id).market, getPrice(e.id).price), daily_profit) + ' days</div>' +
                  '    </div>' +
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
                    orig_i = i.slice(0, 3)
                    console.log('orig_i', i, orig_i)
                    $('#assets-container').append('<div class="asset_summary"><span>' + getCropLandName(i) + ' = </span><span> ' + window.localStorage.getItem(i) + ' </span><span>($' + (window.localStorage.getItem(i) * getUsdPrice(getPrice(orig_i).market, getPrice(orig_i).price)).toFixed(3) + ')</span></div>')
                    total_assets += parseFloat(window.localStorage.getItem(i)) * parseFloat(getUsdPrice(getPrice(orig_i).market, getPrice(orig_i).price))
                }
                else {
                    $('#assets-container').append('<div class="asset_summary"><span>' + getAssetName(i) + ' = </span><span> ' + window.localStorage.getItem(i) + ' </span><span>($' + (window.localStorage.getItem(i) * getUsdPrice(getPrice(i).market, getPrice(i).price)).toFixed(3) + ')</span></div>')
                    total_assets += parseFloat(window.localStorage.getItem(i)) * parseFloat(getUsdPrice(getPrice(i).market, getPrice(i).price))
                }
                //$('#assets-container').append('<div><span>' + getAssetName(i) + ' = </span><span> ' + window.localStorage.getItem(i) + ' </span><span>($' + (window.localStorage.getItem(i) * getUsdPrice(getPrice(i).market, getPrice(i).price)).toFixed(3) + ')</span></div>')
            }
        }
    })
    var production = JSON.parse(window.localStorage.getItem('production'))
    $.each(production, function(i, e){
        //console.log('tp', e.count, getPrice(e.assetId).market, getPrice(e.assetId).price)
        total_production += parseFloat(e.count) * parseFloat(getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price))
        if (e.count > 0.0001){
            $('#production-container').append('<div class="asset_summary"><span>' + getAssetName(e.assetId) + ' = </span><span> ' + e.count.toFixed(3) + ' </span><span> ($' + (parseFloat(e.count) * getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)).toFixed(3) + ')</span></div>')
        }
    })
    var consumption = JSON.parse(window.localStorage.getItem('consumption'))
    $.each(consumption, function(i, e){
        console.log('price', e.assetId, parseFloat(e.count), getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price), parseFloat(e.count) * parseFloat(getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price)))
        total_consumption += parseFloat(e.count) * parseFloat(getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price))
        if (e.count > 0.0001){
            $('#consumption-container').append('<div class="asset_summary"><span>' + getAssetName(e.assetId) + ' = </span><span> ' + (e.count).toFixed(3) + ' </span><span> ($' + (parseFloat(e.count) * parseFloat(getUsdPrice(getPrice(e.assetId).market, getPrice(e.assetId).price))).toFixed(3) + ')</span></div>')
        }
    })
    console.log('tp', total_production, total_consumption)
    var daily_profit = parseFloat(parseFloat(total_production) - parseFloat(total_consumption))
    $('#tdp').text('$ ' + total_production.toFixed(2))
    $('#tdc').text('$ ' + total_consumption.toFixed(2))
    $('#ta').text('$ ' + total_assets.toFixed(2))
    $('#daily-profit').text('$ ' + daily_profit.toFixed(3))
    $('#weekly-profit').text('$ ' + (daily_profit * 7).toFixed(2))
    $('#monthly-profit').text('$ ' + (daily_profit * 30).toFixed(2))
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
  getConfigs();
  getCurrencies();
  getTickers()
  getMarkets();
  showCards();
  updateSummary();
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
})
