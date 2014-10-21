CarCalc.Models.Rate = Backbone.Model.extend({
  monetaryValues: ["hourly", "daily", "kilometer", "cost"],

  bookingFee: CarCalc.Data.bookingFee,

  calculateCost : function(trip, options) {
    var timeCost = 0;
    var distanceCost = trip.get("distance") * this.get("kilometer");

    var combinedTimeRate = trip.get("days") + (trip.get("hours") / 24);

    if (combinedTimeRate >= 1) {
      timeCost = this.get("daily") * combinedTimeRate;
    } else {
      timeCost = this.get("hourly") * trip.get("hours");
    }

    if (options.addVAT) {
      return this.withVAT(distanceCost + timeCost + this.bookingFee);
    } else {
      return (distanceCost + timeCost + this.bookingFee);
    }
  },

  getInfoAndCost: function(trip, options){
    var infoAndCost = this.toJSON();
    infoAndCost.cost = this.calculateCost(trip, { addVAT: false });
    if (options.addVAT) {
      infoAndCost = CarCalc.MoneyHandler.addVAT(infoAndCost);
    }
    for (var i = 0; i < this.monetaryValues.length; i++) {
      var key = this.monetaryValues[i];
      infoAndCost[key] = CarCalc.MoneyHandler.formatAsSEK(infoAndCost[key]);
    }
    return infoAndCost;
  },

});

CarCalc.Models.Trip = Backbone.Model.extend({
  defaults: {
    hours: 0.5,
    days: 0,
    distance: 0
  },

  normalize: function(obj){
    var rules = {
      hours: function(input){
        if (input < 0) {
          input = 0;
        } else if (input > 23.5) {
          input = 23.5;
        }
        return input;
      },

      days: function(input) {
        if (input < 0) {
          input = 0;
        } else if (input > 14) {
          input = 14;
        }
        return input;
      },

      distance: function(input) {
        if (input < 0) {
          input = 0;
        } else if (input > 10000) {
          input = 10000;
        }
        return input;
      }
    };

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = rules[key](obj[key]);
      }
    }
    return obj;
  },

  nanToZero: function(obj){
    for (key in obj) {
      if (isNaN(obj[key])) {
        obj[key] = 0;
      }
    }
    return obj;
  },

  preformat: function(obj){
    for (key in obj) {
      obj[key].replace(/,/, ".");
      obj[key].replace(/\D\./, "");
    }
    return obj;
  },

  floatify: function(obj){
    for (key in obj) {
      obj[key]  = parseFloat(obj[key]);
    }
    return obj;
  },

  setMinimumTime: function(obj){
    if (CarCalc.Util.hasKey(obj, ["hours", "days"])) {
      if (obj.days == 0 && obj.hours == 0) {
        obj.hours = 0.5;
      }
    }
    return obj;
  },

  update: function(obj){
    if (CarCalc.Util.hasKey(obj, ["hours", "days", "distance"])) {
      obj = this.preformat(obj);
      obj = this.floatify(obj);
      obj = this.nanToZero(obj);
      obj = this.normalize(obj);
      obj = this.setMinimumTime(obj);
    }
    this.set(obj);
  }
});
