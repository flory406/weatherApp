export class Model {
  constructor() {
    this.API_KEY = "0bf420971caf1344e6c75eaa98e419cb";
  }

  async getWeather(city) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEY}&units=metric`;
    let weatherData = await fetch(url);
    let parsedData = await weatherData.json();
    return parsedData;
  }

  async getForecast(city) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.API_KEY}&units=metric`;
    let forecastData = await fetch(url);
    let parsedForecastData = await forecastData.json();
    return parsedForecastData;
  }

  async getNearbyPlacesWeather() {
    let cities = ["Lviv", "Kyiv", "Odessa", "Kryvyi Rih"];
    let results = [];

    for (let city of cities) {
      let cityData = await this.getWeather(city);
      results.push(cityData);
    }
    return results;
  }
}
