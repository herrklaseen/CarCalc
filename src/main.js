(function() {
  console.log("calculator starting");

  CarCalc.Trip = new CarCalc.Models.Trip;
  CarCalc.Rates = new CarCalc.Collections.Rates(CarCalc.Data.rates);
  CarCalc.Application = new CarCalc.Views.AppView;

  console.log("calculator running");
}());
