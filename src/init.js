(function() {
  window.CarCalc = {
    Models: {},
    Collections: {},
    Views: {},
    Util: {},
    MoneyHandler: {},
    Data: {}
  };

  /*
   * Please note, these rates must be specified
   * without VAT. CarCalc will add VAT if such option
   * is set to true.
   *
   */
  CarCalc.Data.rates = [
    {
      title: "Klass 1",
      description: "Liten bil, t ex VW Up!.",
      hourly: 15.20,
      daily: 182.40,
      kilometer: 2.16
    },
    {
      title: "Klass 2",
      description: "Något större bil, t ex Toyota Yaris.",
      hourly: 16,
      daily: 192,
      kilometer: 2.24
    },
    {
      title: "Klass 3",
      description: "Stor bil, t ex Skoda Octavia.",
      hourly: 16.80,
      daily: 201.60,
      kilometer: 2.40
    },
    {
      title: "Klass 4",
      description: "Miljöbil, Toyota Prius",
      hourly: 17.60,
      daily: 211.20,
      kilometer: 2.48
    },
    {
      title: "Klass 5",
      description: "Minibuss, VW Caddy 7-sitsig",
      hourly: 18.40,
      daily: 220.80,
      kilometer: 2.56
    },
    {
      title: "Klass 6",
      description: "Skåpbil, VW Caddy fordonsgas",
      hourly: 20,
      daily: 240,
      kilometer: 2.24
    }
  ];

  CarCalc.Util.hasKey = function(obj, ary){
    return (_.find(_.keys(obj),
        function(key){
          return (ary.indexOf(key) != -1)
        }
      )
    )
  };

  CarCalc.MoneyHandler.withVAT = function(num){
    return Math.round((num * 1.25) * 100) / 100;
  };

  CarCalc.MoneyHandler.addVAT = function(obj){
    for (key in obj) {
      if (obj.hasOwnProperty(key) && ! isNaN(parseFloat(obj[key]))){
        obj[key] = CarCalc.MoneyHandler.withVAT(obj[key]);
      }
    }
    return obj;
  };

  CarCalc.MoneyHandler.formatAsSEK = function(num){
    var numstring = num.toFixed(2);
    numstring = numstring.replace(/\.00/, ":–");
    numstring = numstring.replace(/\./, ":");
    return numstring;
  }

}());
