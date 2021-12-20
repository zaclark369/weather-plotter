const searchEl = document.getElementById("main");
const navEl = document.getElementById("navigation");
const apiKey = "e50a47ec15988784ce45ae496cc6fe45";
let cityEl = '';
const searchBtn = document.getElementById("searchbtn");

const retrieveWeather = (apiUrl) => {
  fetch(apiUrl)
    .then((response) => {
      if (response.status === 404) {
        const headerEl = document.createElement("h1");
        headerEl.id = "error-msg";
        headerEl.textContent =
          "Data not found. Please enter a city and try again";
        navEl.appendChild(headerEl);
        return;
      }
      return response.json();
    })
    .then((data) => {
      const cityName = data.name;
      if (!localStorage.getItem("search-history")) {
        const storageArray = [cityName];
        localStorage.setItem("search-history", JSON.stringify(storageArray));
        const headerEl = document.createElement("h1");
        headerEl.classList.add("bg-primary", "text-center", "search-item");
        headerEl.style = "cursor:auto; padding: 2px";
        headerEl.textContent = cityName;
        navEl.appendChild(headerEl);
        headerEl.addEventListener("click", (event) => {
          userCity = event.target.textContent;
          const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityEl}&units=imperial&appid=${apiKey}`;
          retrieveWeather(weatherApi);
        });
      }

      const updateLocalStorage = () => {
        const storageArray = JSON.parse(localStorage.getItem("search-history"));

        while (
          storageArray[storageArray.length - 1] !== cityName &&
          storageArray.length
        ) {
          storageArray.pop();
        }
        if (!storageArray.length) {
          const newArray = JSON.parse(localStorage.getItem("search-history"));
          newArray.push(cityName);
          localStorage.setItem("search-history", JSON.stringify(newArray));
        } else {
          return;
        }
      };

      updateLocalStorage();
      handleStorage();
      
      cityEl = data.name;

      if (document.getElementById("error-msg")) {
        const errorArray = Array.from(document.querySelectorAll("#error-msg"));
        errorArray.forEach((item) => item.remove());
      }

      const apiCall = (data) => {
        fetch(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}&units=imperial`
        )
          .then((response) => response.json())
          .then((data) => {
            if (document.getElementById("current-day")) {
              document.getElementById("current-day").remove();
            }

            const currentDate = new Date(data.current.dt * 1000);
            const month = currentDate.getMonth() + 1;
            const day = currentDate.getDate();
            const year = currentDate.getFullYear();
            const todayEl = document.createElement("section");
            todayEl.classList.add("container", 'border', "col-12", "col-md-12");
            todayEl.id = "current-day";
            const dayContainer = document.createElement("div");
            dayContainer.classList.add("row");

            const dateEl = document.createElement("h2");
            dateEl.textContent = `${month}/${day}/${year}`;
            todayEl.appendChild(dateEl);
            document.getElementById("first-row").appendChild(todayEl);

            const locationEl = document.createElement("h2");
            locationEl.textContent = cityEl;

            const localWeatherEl = document.createElement("h3");
            localWeatherEl.textContent = data.current.weather[0].description;
            localWeatherEl.classList.add("col-4");

            const weatherImage = document.createElement("img");
            weatherImage.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
            weatherImage.classList.add("bg-dark", "col-2", "float");

            dayContainer.appendChild(locationEl);
            dayContainer.appendChild(localWeatherEl);
            dayContainer.appendChild(weatherImage);

            const todayTemperatureEl = document.createElement("h4");
            todayTemperatureEl.textContent = `Temperature (Fahrenheit): ${data.current.temp}`;
            const todayWindEl = document.createElement("h4");
            todayWindEl.textContent = `Wind: ${data.current.wind_speed}mph`;
            const todayHumidityEl = document.createElement("h4");
            todayHumidityEl.textContent = `Humidity: ${data.current.humidity}`;

            const ultravioletEl = document.createElement("h4");
            ultravioletEl.textContent = `UV Index: ${data.current.uvi}`;
            ultravioletEl.classList.add("rounded", "border", "border-1");
            ultravioletEl.style.width = "fit-content";
            ultravioletEl.style.padding = "15px";
            if (data.current.uvi > 2) {
              ultravioletEl.classList.add("bg-warning");
            }
            if (data.current.uvi > 5) {
              ultravioletEl.classList.add("bg-danger");
            } else {
              ultravioletEl.classList.add("bg-success");
            }

            todayEl.appendChild(dayContainer);
            todayEl.appendChild(todayTemperatureEl);
            todayEl.appendChild(todayWindEl);
            todayEl.appendChild(todayHumidityEl);
            todayEl.appendChild(ultravioletEl);

            const forecastHandle = (data) => {
              if (document.getElementById("forecast-container")) {
                document.getElementById("forecast-container").remove();
              }
              const forecastContainerEl = document.createElement("section");
              forecastContainerEl.classList.add("container-fluid");
              forecastContainerEl.id = "forecast-container";
              const forecastRowEl = document.createElement("div");
              forecastRowEl.classList.add("row");

              const forecastArray = [];
              for (let i = 0; i < 6; i++) {
                forecastArray.push(data.daily[i]);
              }

              const createCards = (forecast) => {
                if (!forecast.length) {
                  return;
                }
                const day = forecast.shift();
                const date = new Date(day.dt * 1000);
                const dateEl = document.createElement("h3");
                dateEl.textContent = `${
                  date.getMonth() + 1
                }/${date.getDate()}/${date.getFullYear()}`;

                forecastContainerEl.appendChild(forecastRowEl);
                mainEl.appendChild(forecastContainerEl);

                const cardColumn = document.createElement("div");
                cardColumn.classList.add("col-12");
                const cardEl = document.createElement("div");
                cardEl.classList.add("card", "bg-dark", "border");
                const cardImg = document.createElement("img");
                cardImg.classList.add("card-img-top");
                cardImg.src = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
                cardImg.style.width = "70%";
                const cardBody = document.createElement("div");
                cardBody.classList.add("card-body");
                const cardTemp = document.createElement("h5");
                cardTemp.classList.add("fs-5");
                cardTemp.textContent = `Temp: ${day.temp.day} deg`;
                const cardWind = document.createElement("h5");
                cardWind.classList.add("fs-5");
                cardWind.textContent = `Wind: ${day.wind_speed}mph`;
                const cardHumidity = document.createElement("h5");
                cardHumidity.classList.add("fs-5");
                cardHumidity.textContent = `Humidity: ${day.humidity}`;

                cardEl.appendChild(cardImg);
                cardEl.appendChild(cardBody);
                cardBody.appendChild(dateEl);
                cardBody.appendChild(cardTemp);
                cardBody.appendChild(cardWind);
                cardBody.appendChild(cardHumidity);
                forecastRowEl.appendChild(cardColumn);
                cardColumn.appendChild(cardEl);

                forecastHandle(forecast);
              };
              forecastHandle(forecastArray);
            };
            forecastHandle(data);
          });
      };
      apiCall(data);
    });
};

function handleClick() {
  const inputEl = document.getElementById("search-city");
  cityEl = inputEl.value;
  console.log(cityEl);
  const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityEl}&units=imperial&appid=${apiKey}`;
  retrieveWeather(weatherApi);
}

function keyFunction(event) {
  if (event.keyCode === 13) {
    const inputEl = document.getElementById("search-city");
    userCity = inputEl.value;
    const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityEl}&units=imperial&appid=${apiKey}`;
    retrieveWeather(weatherApi);
  }
}

searchBtn.addEventListener("click", handleClick);
document.getElementById("search-city").addEventListener("keyup", keyFunction);

const handleStorage = () => {
  if (localStorage.getItem("search-history")) {
    const searchItems = Array.from(document.querySelectorAll(".search-item"));
    searchItems.forEach((item) => {
      item.remove();
    });

    const historyEl = JSON.parse(localStorage.getItem("search-history"));
    historyEl.forEach(function (item) {
      const headerEl = document.createElement("h1");
      headerEl.classList.add("bg-primary", "text-center", "search-item");
      headerEl.style = "padding: 7px";
      headerEl.textContent = item;
      navEl.appendChild(headerEl);
      headerEl.addEventListener("click", (event) => {
        cityEl = event.target.textContent;
        const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${cityEl}&units=imperial&appid=${apiKey}`;
        retrieveWeather(weatherAPI);
      });
    });
  }
};

handleStorage();
