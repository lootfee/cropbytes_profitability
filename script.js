produce_data = [{'item': 'Milk',
                  'ticker': 'milk',
                  'market': 'cbx',
                  },
                {'item': 'Egg',
                  'ticker': 'egg',
                  'market': 'cbx',
                  },
                {'item': 'Truffles',
                  'ticker': 'trf',
                  'market': 'cbx',
                  },
                {'item': 'Fur',
                  'ticker': 'fur',
                  'market': 'cbx',
                  },
                {'item': 'Feather',
                  'ticker': 'ftr',
                  'market': 'cbx',
                  },
                {'item': 'Horse Hair',
                  'ticker': 'hhr',
                  'market': 'cbx',
                  },
                {'item': 'Wool',
                  'ticker': 'wool',
                  'market': 'cbx',
                  },
                {'item': 'Power',
                  'ticker': 'pow',
                  'market': 'cbx',
                  },
                {'item': 'Corn Feed',
                  'ticker': 'cof',
                  'market': 'trx',
                  },
                {'item': 'Carrot Feed',
                  'ticker': 'caf',
                  'market': 'trx',
                  },
                {'item': 'Breed Feed',
                  'ticker': 'sbf',
                  'market': 'trx',
                  },
                {'item': 'Fruit Feed',
                  'ticker': 'frf',
                  'market': 'trx',
                  },
                {'item': 'Water',
                  'ticker': 'water',
                  'market': 'trx',
                  },
                ]


item_data = [
        {'item': 'Blackshine',
         'ticker': 'bs',
         'market': 'cbx',
         'water': 2,
         'cof': 3,
         'caf': 0,
         'frf': 0,
         'produce': 'milk',
         'produce_ticker': 'milk',
         'produce_qty': 3,
         'produce_time': 1
        },
        {'item': 'Pygmy Cream Goat',
         'ticker': 'pcg',
         'market': 'trx',
         'water': 1,
         'cof': 3,
         'caf': 0,
         'frf': 0,
         'produce': 'milk',
         'produce_ticker': 'milk',
         'produce_qty': 3,
         'produce_time': 1
        },
        {'item': 'Black Bull',
         'ticker': 'bb',
         'market': 'cbx',
         'water': 2,
         'cof': 4,
         'caf': 0,
         'frf': 0,
         'produce': 'fur',
         'produce_ticker': 'fur',
         'produce_qty': 2,
         'produce_time': 1
        },
        {'item': 'Highland Cow',
         'ticker': 'hgc',
         'market': 'cbx',
         'water': 4,
         'cof': 12,
         'caf': 0,
         'frf': 0,
         'produce': 'milk',
         'produce_ticker': 'milk',
         'produce_qty': 8,
         'produce_time': 1
        },
        {'item': 'Dutch Belted Cow',
         'ticker': 'dbc',
         'market': 'cbx',
         'water': 0,
         'cof': 6,
         'caf': 0,
         'frf': 0,
         'produce': 'milk',
         'produce_ticker': 'milk',
         'produce_qty': 2,
         'produce_time': 1
        },
        {'item': 'Eagger',
         'ticker': 'egr',
         'market': 'trx',
         'water': 1,
         'cof': 2,
         'caf': 0,
         'frf': 0,
         'produce': 'egg',
         'produce_ticker': 'egg',
         'produce_qty': 4,
         'produce_time': 1
        },
        {'item': 'B Rooster',
         'ticker': 'br',
         'market': 'cbx',
         'water': 2,
         'cof': 2,
         'caf': 0,
         'frf': 0,
         'produce': 'feather',
         'produce_ticker': 'ftr',
         'produce_qty': 2,
         'produce_time': 3
        },
        {'item': 'Zing',
         'ticker': 'zing',
         'market': 'cbx',
         'water': 3,
         'cof': 6,
         'caf': 0,
         'frf': 0,
         'produce': 'horse hair',
         'produce_ticker': 'hhr',
         'produce_qty': 2,
         'produce_time': 1
        },
        {'item': 'Badshaw',
         'ticker': 'bsh',
         'market': 'cbx',
         'water': 3,
         'cof': 6,
         'caf': 0,
         'frf': 0,
         'produce': 'horse hair',
         'produce_ticker': 'hhr',
         'produce_qty': 2,
         'produce_time': 1
        },
        {'item': 'Mud',
         'ticker': 'mud',
         'market': 'cbx',
         'water': 1,
         'cof': 3,
         'caf': 0,
         'frf': 0,
         'produce': 'truffles',
         'produce_ticker': 'trf',
         'produce_qty': 4,
         'produce_time': 2
        },
        {'item': 'Ossabaw',
         'ticker': 'osb',
         'market': 'cbx',
         'water': 0,
         'cof': 4,
         'caf': 0,
         'frf': 0,
         'produce': 'truffles',
         'produce_ticker': 'trf',
         'produce_qty': 2,
         'produce_time': 2
        },
        {'item': 'Sparky',
         'ticker': 'spky',
         'market': 'cbx',
         'water': 3,
         'cof': 6,
         'caf': 0,
         'frf': 0,
         'produce': 'truffles',
         'produce_ticker': 'trf',
         'produce_qty': 4,
         'produce_time': 1
        },
        {'item': 'Dor',
         'ticker': 'dor',
         'market': 'cbx',
         'water': 2,
         'cof': 4,
         'caf': 0,
         'frf': 0,
         'produce': 'wool',
         'produce_ticker': 'wool',
         'produce_qty': 6,
         'produce_time': 1
        },
        ]


function getPrice(ticker, market){
  var price = 0
  $.ajax({
    url: 'https://api.cropbytes.com/api/v2/peatio/public/markets/' + ticker + market + '/trades',
    context: 'application/json',
    async:false,
    }).done(function(data) {
    price =  data[0].price
  });
  return price
}

function getUsdPrice(market, price){
  var usd = $('#' + market + 'usd').html()
  var usd_price = (parseFloat(usd) * parseFloat(price)).toFixed(4)
  return usd_price
}

function getRoi(price, market, water, cof, caf, frf, produce_ticker, qty, time){
  var price_usd = getUsdPrice(market, price)
  var produce_usd = getUsdPrice($('#' + produce_ticker).data('market'), $('#' + produce_ticker).data('curr_price'))
  var cof_usd = getUsdPrice($('#cof').data('market'), $('#cof').data('curr_price'))
  var caf_usd = getUsdPrice($('#caf').data('market'), $('#caf').data('curr_price'))
  var frf_usd = getUsdPrice($('#frf').data('market'), $('#frf').data('curr_price'))
  var water_usd = getUsdPrice($('#water').data('market'), $('#water').data('curr_price'))
  var daily_income = ((qty/time) * produce_usd).toFixed(4)
  var daily_expenses = ((cof * parseFloat(cof_usd)) + (caf * parseFloat(caf_usd)) + (frf * parseFloat(frf_usd)) + (water * parseFloat(water_usd))).toFixed(4)
  var daily_profit = (daily_income - daily_expenses).toFixed(4)
  var roi = (parseInt(price_usd)/daily_profit).toFixed(1)
  console.log(price)
  return {'daily_income': daily_income, 'daily_expenses': daily_expenses, 'daily_profit': daily_profit, 'roi': roi}
}

function getTrxUsd(){
  var price = 0
    $.ajax({
      url: "https://api.cropbytes.com/api/v2/peatio/public/markets/trxusdt/trades",
      context: 'application/json',
      async: false
    }).done(function(data) {
      $('#trxusd').html(data[0].price);
    return data[0].price
  });
}

function getCbxUsd(){
  $.ajax({
    url: "https://api.cropbytes.com/api/v2/peatio/public/markets/cbxusdt/trades",
    context: 'application/json',
    async: false
  }).done(function(data) {
    $('#cbxusd').html(data[0].price);
    return data[0].price
  });
}

function getProduceData(){
  $('#produce_monitor .marquee_inner1').empty()
  $('#produce_monitor .marquee_inner2').empty()
  $(produce_data).each(function(i, e){
    var price = getPrice(e.ticker, e.market)
      $('#produce_monitor .marquee_inner1').append(
        '<span id=' + e.ticker + ' data-curr_price=' + price + ' data-market=' + e.market +'>' + e.ticker.toUpperCase() + '/' + e.market.toUpperCase() + ' = ' + price + '</span>'
      );
      $('#produce_monitor .marquee_inner2').append(
        '<span>' + e.ticker.toUpperCase() + '/' + e.market.toUpperCase() + ' = ' + price + '</span>'
      );
  })
}

function refreshData(){
    
}

function addTableRow(){
  $('.table tbody').empty();
  $(item_data).each(function(i, e){
    var market_price = getPrice(e.ticker, e.market)
    var income = getRoi(market_price, e.market, e.water, e.cof, e.caf, e.frf, e.produce_ticker, e.produce_qty, e.produce_time)
    if(isNaN(income.roi)) {
      income.roi = 0;
      }
    if(income.roi < 0) {
      income.roi = 0;
      }
    var tr = $('<tr></tr>')
    $(tr).append('<td>' + e.item + '</td>');
    $(tr).append('<td>' + market_price + '</td>');
    $(tr).append('<td>' + e.market.toUpperCase() + '</td>');
    $(tr).append('<td>' + getUsdPrice(e.market, market_price) + '</td>');
    $(tr).append('<td>' + e.water + '</td>');
    $(tr).append('<td>' + e.cof + '</td>');
    $(tr).append('<td>' + e.caf + '</td>');
    $(tr).append('<td>' + e.frf + '</td>');
    $(tr).append('<td>' + e.produce.toUpperCase() + '</td>');
    $(tr).append('<td>' + e.produce_qty + '</td>');
    $(tr).append('<td>' + e.produce_time + '</td>');
    $(tr).append('<td> $' + income.daily_expenses + '</td>');
    $(tr).append('<td> $' + income.daily_income + '</td>');
    $(tr).append('<td> $' + income.daily_profit + '</td>');
    $(tr).append('<td> ' + income.roi + '</td>');
    $('.table tbody').append(tr)
  })
}

$(document).ready(function(){
  getTrxUsd();
  getCbxUsd();
  getProduceData();
  refreshData();
  addTableRow();
  setInterval(function() {
    getTrxUsd();
    getCbxUsd();
    getProduceData();
    refreshData();
    addTableRow();
  }, 300000);
})
 