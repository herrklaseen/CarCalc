CarCalc.Views.TripView = Backbone.View.extend({
  tagName: "div",

  id: "carcalc-input-container",

  template: _.template(jQuery("#carcalc-input-template").html()),

  initialize: function(){
    _.bindAll(this, "render");
    this.render();
  },

  events: {
    "click input[type=submit]": "updateTrip"
  },

  updateTrip: function(){
    var input = {
      hours: jQuery("#carcalc-input-hours").val(),
      days: jQuery("#carcalc-input-days").val(),
      distance: jQuery("#carcalc-input-distance").val()
    };
    this.model.update(input);
    this.render();
  },

  render: function(){
    this.el.innerHTML = this.template(this.model.toJSON());
    return this;
  }
});

CarCalc.Views.RateView = Backbone.View.extend({
  template: _.template(jQuery("#carcalc-output-rate-row-template").html()),

  initialize: function(){
    _.bindAll(this, "render");
    this.render();
  },

  render: function(){
    var infoAndCost = this.model.getInfoAndCost(CarCalc.Trip, { addVAT: true });
    this.el.innerHTML = this.template(infoAndCost);
    return this;
  }
});

CarCalc.Views.RatesView = Backbone.View.extend({
  tagName: "table",

  id: "carcalc-output-container",

  tableHeader: _.template(jQuery("#carcalc-output-rate-table-header").html()),

  tableFooter: _.template(jQuery("#carcalc-output-rate-table-footer").html()),

  initialize: function(){
    var that = this;
    this._rateViews = [];

    this.collection.each(function(rate){
      that._rateViews.push(new CarCalc.Views.RateView({
        model: rate,
        tagName: "tr"
      }));
    });

    this.listenTo(CarCalc.Trip, "change", this.render);

    _.bindAll(this, "render");
    this.render();
  },

  render: function(){
    var that = this;
    this.$el.empty();
    this.$el.append(this.tableHeader());
    _(this._rateViews).each(function(rv){
      jQuery(that.el).append(rv.render().el);
    });
    this.$el.append(this.tableFooter());

    return this;
  }
});

CarCalc.Views.AppView = Backbone.View.extend({
  el: jQuery("#carcalc-container"),

  initialize: function(){
    _.bindAll(this, "render");
    this.render(CarCalc.Trip, CarCalc.Rates);
  },

  render: function(trip, rates){
    var tripView = new CarCalc.Views.TripView({ model: trip });
    var ratesView = new CarCalc.Views.RatesView({ collection: rates });
    this.$el.append(tripView.render().el);
    this.$el.append(ratesView.render().el);
  }
});
