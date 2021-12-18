const searchEl = document.getElementById('main');
const navEl = document.getElementById('nav-column');
const apiKey = 'e50a47ec15988784ce45ae496cc6fe45';
let cityEl = '';
const searchBtn = document.getElementById('searchbtn');


const retrieveWeather = (apiUrl) => {
    fetch(apiUrl)
      .then((response) => {
        if (response.status === 404) {
          const headerEl = document.createElement('h1');
          headerEl.id = 'error-msg';
          headerEl.textContent = 'Data not found. Please enter a city and try again';
          navEl.appendChild(headerEl);
          return;
        }
        return response.json();
      })
      .then((data) => {
        const cityName = data.name;
        if (!localStorage.getItem('search-history')) {
          const storageArray = [cityName];
          localStorage.setItem('search-history', JSON.stringify(storageArray));
          const headerEl = document.createElement('h1');
          headerEl.classList.add(
            'bg-primary',
            'text-center',
            'search-item'
          );
          headerEl.style = 'cursor:auto; padding: 2px';
          headerEl.textContent = cityName;
          navEl.appendChild(headerEl);
          headerEl.addEventListener('click', (event) => {
            userCity = event.target.textContent;
            const weatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${cityEl}&units=imperial&appid=${apiKey}`;
            fetchWeather(weatherApi);
          });
        }

        const updateLocalStorage = () => {
            const storageArray = JSON.parse(localStorage.getItem('search-history'));

            while (storageArray[storageArray.length-1] !== cityName && storageArray.length) {
                storageArray.pop();
            }
            if(!storageArray.length) {
                const newArray = JSON.parse(localStorage.getItem('search-history'));
                newArray.push(cityName);
                localStorage.setItem('search-history', JSON.stringify(newArray));
            }
            else
            {
                return;
            }
        };

        updateLocalStorage();
        handleStorage();
        // cityEl = data.name;

        if (document.getElementById('error-msg')) {
            const errorArray = Array.from(document.querySelectorAll('#error-msg'));
            errorArray.forEach((item) => item.remove());
        }

        const apiCall = (data) => {
            fetch(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}&units=imperial`
            )
            .then((response) => response.json())
            .then((data) => {
                if (document.getElementById('current-day')) {
                    document.getElementById('current-day').remove();
                }

                const currentDate = new Date(data.current.dt *1000);
                const month = currentDate.getMonth() + 1;
            const day = currentDate.getDate();
            const year = currentDate.getFullYear();
            const currentDayEl = document.createElement('section');
            })
        }

    };
};