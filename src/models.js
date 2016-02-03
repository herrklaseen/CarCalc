CarCalc.Models.Rate = Backbone.Model.extend({
  monetaryValues: ["hourly", "daily", "kilometer", "cost"],

  bookingFee: CarCalc.Data.bookingFee,

  excessReduction: CarCalc.Data.excessReduction,

  calculateCost : function(trip, options) {
    var timeCost = this.calculateTimeCost(trip);
    var distanceCost = this.calculateDistanceCost(trip);

    return (distanceCost + timeCost + this.bookingFee);
  },

  calculateTimeCost: function(trip){
    var timeCost = 0;
    var combinedTime = trip.get("days") + (trip.get("hours") / 24);

    if (combinedTime >= 1) {
      timeCost = this.get("daily") * combinedTime;
      timeCost += this.excessReduction.daily;
    } else {
      timeCost = this.get("hourly") * (combinedTime * 24);
      timeCost += this.excessReduction.hourly * (combinedTime * 24);
      if (timeCost > this.getMaximumDailyRate()) {
        timeCost = this.getMaximumDailyRate();
      }
    }
    console.log(this.get("title") + ": " + timeCost);
    return timeCost;
  },

  getMaximumDailyRate: function() {
    return this.get("daily") + this.excessReduction.daily;
  },

  calculateDistanceCost: function(trip){
    var distanceCost = trip.get("distance") * this.get("kilometer");
    return distanceCost;
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
    hours: 0,
    days: 0,
    distance: 0
  },

  normalize: function(obj){
    var rules = {
      hours: function(input){
        if (input < 0) {
          input = 0;
        } else if (input > 72) {
          input = 72;
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

  timeInDays: function(obj){
    var days = 0;
    days = days + obj.days;
    days = days + (obj.hours / 24);
    return days;
  },

  setMaximumTime: function(obj){
    if (this.timeInDays(obj) > 14) {
      obj.hours = 0;
      obj.days = 14;
    }
    return obj;
  },

  update: function(obj){
    if (CarCalc.Util.hasKey(obj, ["hours", "days", "distance"])) {
      obj = this.preformat(obj);
      obj = this.floatify(obj);
      obj = this.nanToZero(obj);
      obj = this.normalize(obj);
      obj = this.setMaximumTime(obj);
    }
    this.set(obj);
  }
});
