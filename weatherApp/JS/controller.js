import { Model } from "./model.js";
import { View } from "./view.js";

class Controller {
  async handleSearchCity(cityName) {
    try {
      console.log("Шукаємо місто:", cityName);
      let weatherData = await this.model.getWeather(cityName);
      console.log(weatherData);

      this.view.renderCurrentWeather(weatherData);

      let forecastData = await this.model.getForecast(cityName);
      console.log(forecastData);
      this.view.renderHourlyForecast(forecastData);
      this.view.renderFiveDaysForecast(forecastData);
    } catch (error) {
      alert("Помилка: Місто не знайдено, або проблеми зі з'єднанням!");
    }
  }

  async init() {
    this.handleSearchCity("Vynnyky");
    let nearbyPlaces = await this.model.getNearbyPlacesWeather();
    this.view.renderNearbyPlaces(nearbyPlaces);
  }

  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindSearchCity((city) => this.handleSearchCity(city));
    this.init();
    this.view.bindToggleTabs();
  }
}

let app = new Controller(new Model(), new View());
