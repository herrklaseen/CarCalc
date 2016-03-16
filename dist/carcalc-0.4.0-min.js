!function(){window.CarCalc={Models:{},Collections:{},Views:{},Util:{},MoneyHandler:{},Data:{}},CarCalc.Data.rates=[{title:"Prisklass 1",description:"Liten bil, t ex VW Up!",hourly:15.2,daily:182.4,kilometer:2.16},{title:"Prisklass 2",description:"Något större bil, t ex Toyota Yaris",hourly:16,daily:192,kilometer:2.24},{title:"Prisklass 3",description:"Stor bil, t ex Skoda Octavia",hourly:16.8,daily:201.6,kilometer:2.4},{title:"Prisklass 4",description:"Miljöbil, Toyota Prius",hourly:17.6,daily:211.2,kilometer:2.48},{title:"Prisklass 5",description:"Minibuss, VW Caddy 7-sitsig",hourly:18.4,daily:220.8,kilometer:2.56},{title:"Prisklass 6",description:"Skåpbil, VW Caddy fordonsgas",hourly:20,daily:240,kilometer:2.24}],CarCalc.Data.bookingFee=24,CarCalc.Data.excessReduction={hourly:.8,daily:16},CarCalc.Util.hasKey=function(a,b){return _.find(_.keys(a),function(a){return-1!=b.indexOf(a)})},CarCalc.MoneyHandler.withVAT=function(a){return Math.round(1.25*a*100)/100},CarCalc.MoneyHandler.addVAT=function(a){for(key in a)a.hasOwnProperty(key)&&!isNaN(parseFloat(a[key]))&&(a[key]=CarCalc.MoneyHandler.withVAT(a[key]));return a},CarCalc.MoneyHandler.formatAsSEK=function(a){var b=a.toFixed(2);return b=b.replace(/\.00/,":–"),b=b.replace(/\./,":")}}(),CarCalc.Models.Rate=Backbone.Model.extend({monetaryValues:["hourly","daily","kilometer","cost"],bookingFee:CarCalc.Data.bookingFee,excessReduction:CarCalc.Data.excessReduction,calculateCost:function(a,b){var c=this.calculateTimeCost(a),d=this.calculateDistanceCost(a);return d+c+this.bookingFee},calculateTimeCost:function(a){var b=0,c=a.get("days")+a.get("hours")/24;return c>=1?(b=this.get("daily")*c,b+=this.excessReduction.daily):(b=this.get("hourly")*(24*c),b+=this.excessReduction.hourly*(24*c),b>this.getMaximumDailyRate()&&(b=this.getMaximumDailyRate())),b},getMaximumDailyRate:function(){return this.get("daily")+this.excessReduction.daily},calculateDistanceCost:function(a){var b=a.get("distance")*this.get("kilometer");return b},getInfoAndCost:function(a,b){var c=this.toJSON();c.cost=this.calculateCost(a,{addVAT:!1}),b.addVAT&&(c=CarCalc.MoneyHandler.addVAT(c));for(var d=0;d<this.monetaryValues.length;d++){var e=this.monetaryValues[d];c[e]=CarCalc.MoneyHandler.formatAsSEK(c[e])}return c}}),CarCalc.Models.Trip=Backbone.Model.extend({defaults:{hours:0,days:0,distance:0},normalize:function(a){var b={hours:function(a){return 0>a?a=0:a>72&&(a=72),a},days:function(a){return 0>a?a=0:a>14&&(a=14),a},distance:function(a){return 0>a?a=0:a>1e4&&(a=1e4),a}};for(key in a)a.hasOwnProperty(key)&&(a[key]=b[key](a[key]));return a},nanToZero:function(a){for(key in a)isNaN(a[key])&&(a[key]=0);return a},preformat:function(a){for(key in a)a[key].replace(/,/,"."),a[key].replace(/\D\./,"");return a},floatify:function(a){for(key in a)a[key]=parseFloat(a[key]);return a},timeInDays:function(a){var b=0;return b+=a.days,b+=a.hours/24},setMaximumTime:function(a){return this.timeInDays(a)>14&&(a.hours=0,a.days=14),a},update:function(a){CarCalc.Util.hasKey(a,["hours","days","distance"])&&(a=this.preformat(a),a=this.floatify(a),a=this.nanToZero(a),a=this.normalize(a),a=this.setMaximumTime(a)),this.set(a)}}),CarCalc.Collections.Rates=Backbone.Collection.extend({model:CarCalc.Models.Rate}),CarCalc.Views.TripView=Backbone.View.extend({tagName:"div",id:"carcalc-input-container",template:_.template(jQuery("#carcalc-input-template").html()),initialize:function(){_.bindAll(this,"render"),this.render()},events:{"click input[type=submit]":"updateTrip"},updateTrip:function(){var a={hours:jQuery("#carcalc-input-hours").val(),days:jQuery("#carcalc-input-days").val(),distance:jQuery("#carcalc-input-distance").val()};this.model.update(a),this.render()},render:function(){return this.el.innerHTML=this.template(this.model.toJSON()),this}}),CarCalc.Views.RateView=Backbone.View.extend({template:_.template(jQuery("#carcalc-output-rate-row-template").html()),initialize:function(){_.bindAll(this,"render"),this.render()},render:function(){var a=this.model.getInfoAndCost(CarCalc.Trip,{addVAT:!0});return this.el.innerHTML=this.template(a),this}}),CarCalc.Views.RatesView=Backbone.View.extend({tagName:"table",id:"carcalc-output-container",tableHeader:_.template(jQuery("#carcalc-output-rate-table-header").html()),tableFooter:_.template(jQuery("#carcalc-output-rate-table-footer").html()),initialize:function(){var a=this;this._rateViews=[],this.collection.each(function(b){a._rateViews.push(new CarCalc.Views.RateView({model:b,tagName:"tr"}))}),this.listenTo(CarCalc.Trip,"change",this.render),_.bindAll(this,"render"),this.render()},render:function(){var a=this;return this.$el.empty(),this.$el.append(this.tableHeader()),_(this._rateViews).each(function(b){jQuery(a.el).append(b.render().el)}),this.$el.append(this.tableFooter()),this}}),CarCalc.Views.AppView=Backbone.View.extend({el:jQuery("#carcalc-container"),initialize:function(){_.bindAll(this,"render"),this.render(CarCalc.Trip,CarCalc.Rates)},render:function(a,b){var c=new CarCalc.Views.TripView({model:a}),d=new CarCalc.Views.RatesView({collection:b});this.$el.append(c.render().el),this.$el.append(d.render().el)}}),function(){console.log("calculator starting"),CarCalc.Trip=new CarCalc.Models.Trip,CarCalc.Rates=new CarCalc.Collections.Rates(CarCalc.Data.rates),CarCalc.Application=new CarCalc.Views.AppView,console.log("calculator running")}();