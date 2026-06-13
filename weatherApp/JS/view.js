export class View {
  constructor() {
    this.townInput = document.getElementById("town-input");
    this.searchTownBtn = document.getElementById("search-town-btn");

    this.currentCity = document.getElementById("current-city");
    this.currentTemp = document.getElementById("current-temp");

    this.currentDesc = document.getElementById("current-desc");
    this.currentFeelsLike = document.getElementById("current-feels-like");

    this.currentIcon = document.getElementById("current-icon");
    this.currentSunrise = document.getElementById("current-sunrise");

    this.currentSunset = document.getElementById("current-sunset");
    this.currentDuration = document.getElementById("current-duration");

    this.hourlyForecastContainer = document.getElementById(
      "hourly-forecast-container",
    );
    this.nearbyPlacesContainer = document.getElementById(
      "nearby-places-container",
    );

    this.tabToday = document.getElementById("tab-today");
    this.tab5Days = document.getElementById("tab-5days");

    this.fiveDaysContainer = document.getElementById("five-days-container");
  }

  bindSearchCity(handler) {
    this.searchTownBtn.addEventListener("click", () => {
      if (this.townInput.value !== "") {
        handler(this.townInput.value);
      }
    });

    this.townInput.addEventListener("keypress", (ev) => {
      if (ev.key === "Enter" && this.townInput.value !== "") {
        handler(this.townInput.value);
      }
    });
  }

  renderCurrentWeather(data) {
    this.currentCity.textContent = data.name;
    this.currentTemp.textContent = `${Math.round(data.main.temp)} °C`;
    this.currentDesc.textContent = data.weather[0].main;
    this.currentFeelsLike.textContent = `${Math.round(data.main.feels_like)} °C`;

    this.currentIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    this.currentSunrise.textContent = this.formatTime(data.sys.sunrise);
    this.currentSunset.textContent = this.formatTime(data.sys.sunset);
    this.currentDuration.textContent = this.calculateDuration(
      data.sys.sunrise,
      data.sys.sunset,
    );
  }

  renderHourlyForecast(forecastData) {
    let slicedArray = forecastData.list.slice(0, 6);

    this.hourlyForecastContainer.innerHTML = `
      <div class="d-flex flex-column text-start me-3 justify-content-between text-white-50 small fw-bold" style="min-width: 90px; padding-top: 5px">
        <span class="mb-3 text-dark">TODAY</span>
        <span class="mb-3 mt-4 pt-2">Forecast</span>
        <span class="mb-3">Temp (°C)</span>
        <span class="mb-3">RealFeel</span>
        <span>Wind (km/h)</span>
      </div>
    `;

    slicedArray.forEach((item) => {
      this.hourlyForecastContainer.innerHTML += `
        <div class="d-flex flex-column align-items-center justify-content-between glass-panel-inner p-3 hourly-col" style="min-width: 100px">
          <span class="mb-2 fw-medium">${this.formatTime(item.dt)}</span>
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].main}" width="45" class="mb-2" />
          <span class="mb-3 small text-white-50">${item.weather[0].main}</span>
          <span class="mb-3 fw-bold fs-5">${Math.round(item.main.temp)}°</span>
          <span class="mb-3 fw-bold fs-5 text-white-50">${Math.round(item.main.feels_like)}°</span>
          <span class="text-white-50 small">${Math.round(item.wind.speed * 3.6)}</span>
        </div>
      `;
    });
  }

  renderNearbyPlaces(placesData) {
    this.nearbyPlacesContainer.innerHTML = "";
    placesData.forEach((item) => {
      this.nearbyPlacesContainer.innerHTML += `
        <div class="col-12 col-md-6">
          <div class="d-flex justify-content-between align-items-center glass-panel-inner p-3">
            <span class="fw-medium fs-5">${item.name}</span>
            <div class="d-flex align-items-center gap-2">
              <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" width="40" alt="Icon" />
              <span class="fw-bold fs-4">${Math.round(item.main.temp)}°C</span>
            </div>
          </div>
        </div>`;
    });
  }

  renderFiveDaysForecast(forecastData) {
    this.fiveDaysContainer.innerHTML = "";

    let filteredArray = forecastData.list.filter((item) =>
      item.dt_txt.includes("12:00:00"),
    );

    let htmlString = `<div class="d-flex text-center overflow-x-auto gap-3 pb-3 custom-scrollbar">`;

    filteredArray.forEach((item) => {
      let dateObj = new Date(item.dt * 1000);
      let dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });

      htmlString += `
        <div class="d-flex flex-column align-items-center justify-content-between glass-panel-inner p-3 hourly-col" style="min-width: 120px">
          <span class="mb-2 fw-medium">${dayName}</span>
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].main}" width="45" class="mb-2" />
          <span class="mb-3 small text-white-50">${item.weather[0].main}</span>
          <span class="mb-3 fw-bold fs-5">${Math.round(item.main.temp)}°</span>
        </div>
      `;
    });

    htmlString += `</div>`;
    this.fiveDaysContainer.innerHTML = htmlString;
  }

  formatTime(unixTime) {
    let date = new Date(unixTime * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  calculateDuration(sunrise, sunset) {
    let diffSeconds = sunset - sunrise;
    let hours = Math.floor(diffSeconds / 3600);
    let minutes = Math.floor((diffSeconds % 3600) / 60);

    let formattedHours = hours.toString().padStart(2, "0");
    let formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes} hr`;
  }

  bindToggleTabs() {
    this.tabToday.addEventListener("click", (ev) => {
      ev.preventDefault();

      this.tabToday.classList.add("active");
      this.tab5Days.classList.remove("active");

      this.hourlyForecastContainer.classList.remove("d-none");
      this.fiveDaysContainer.classList.add("d-none");
    });

    this.tab5Days.addEventListener("click", (ev) => {
      ev.preventDefault();

      this.tab5Days.classList.add("active");
      this.tabToday.classList.remove("active");

      this.fiveDaysContainer.classList.remove("d-none");
      this.hourlyForecastContainer.classList.add("d-none");
    });
  }
}
