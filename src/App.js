import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import '../node_modules/jquery/dist/jquery.js';
import './App.css';

function App() {
  const [searchCity, setSearchCity] = useState('');
  const [cityArray, setCityArray] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationData, setLocationData] = useState(null);
  const [date, setDate] = useState(new Date().toDateString());
  const [temp, setTemp] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const apiKey = "cd4b12d6f1d930a7ef04e18f67235f2e"

  const fetchWeatherData = async (city) => {
    if (!city) return;
    try {
      let response;
      if (city.includes(',')) {
        const [zip, country] = city.split(',').map(str => str.trim());
        response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},${country}&appid=${apiKey}`);
      } else {
        response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
      }
      return response.data;
    } catch (error) {
      console.error('Error in fetching weather data:', error);
    }
  };

  const fetchLocationWeather = async () => {
    if (!location.latitude || !location.longitude) return;
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}`);
      setLocationData(response.data);
    } catch (error) {
      console.error('Error fetching location weather data:', error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting the location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    fetchLocationWeather();
  }, [location]);

  const handleSearchCity = async () => {
    const data = await fetchWeatherData(searchCity);
    if (data) {
      setWeatherData(data);
      setSearchCity('');
    }
  };

  const handleAddCity = async () => {
    const data = await fetchWeatherData(searchCity);
    if (data) {
      setCityArray([...cityArray, data]);
      setSearchCity('');
    }
  };

  const WeatherDisplay = ({ data, temp, setTemp, date }) => {
    return (
      <div className='subMaincards'>
        <div className='serchcitys'>
          <div className='city p-2 rounded-4'>
            <div className='row'>
              <div className='rowRight'>
                <div>
                  <span className='bi-geo-alt-fill bg-light text-dark btn rounded-5'>{data.name}</span>
                </div>
                <div>
                  <span>{date}</span>
                </div>
                <div>
                  <span className='fs-1 fw-medium'>{temp ? Math.round((data.main.temp - 273.15)) + ' °C' : (data.main.temp) + ' K'}</span>
                  <div><span>High: {temp ? Math.round((data.main.temp_max - 273.15)) + ' °C' : (data.main.temp_max) + ' K'} Low: {temp ? Math.round((data.main.temp_min - 273.15)) + ' °C' : (data.main.temp_min) + ' K'}</span></div>
                </div>
              </div>
              <div className='rowLeft'>
                <div className='d-flex flex-column justify-content-between align-items-end pe-4'>
                  <div className='form-switch d-flex justify-content-center align-items-center'>
                    <input type="checkbox" className='form-check-input fs-4' checked={temp} onChange={() => setTemp(!temp)} /> <span className=' fs-4'>{temp?' °C':' K'}</span>
                  </div>
                  <div>
                    <div><span className='text-light fs-2'>{data.weather[0].description}</span></div>
                    <div><span>Feels like{temp ? Math.round((data.main.feels_like - 273.15)) + ' °C' : (data.main.feels_like) + ' K'}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='todayHighlight rounded-4 p-2'>
            <button className='btn btn-light rounded-5'>Today Highlight</button>
            <div className='d-flex mt-2'>
              <div className='humidity'>
                <div>
                  <b className='bi-droplet-half'> Humidity</b>
                </div>
                <div>{data.main.humidity} %</div>
              </div>
              <div className='speed'>
                <div>
                  <b className='bi-wind'> Wind speed</b>
                </div>
                <div>{data.wind.speed} km/h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className='main bg-dark-subtle p-2 rounded-3'>
        <header className='d-flex justify-content-center align-items-center'>
          <div className='me-2' data-bs-toggle="modal" data-bs-target="#multiplecity">
            <span className='bi-plus btn btn-dark text-light'></span>
          </div>
          {/* search bar multiplecitys weathers */}
          <div className='modal fade' id='multiplecity'>
            <div className='modal-dialog'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <div className='input-group'>
                    <span className='bi-geo-alt-fill btn btn-dark text-light'></span>
                    <input
                      type='text'
                      placeholder='Search City OR zip,country'
                      size={40}
                      className='search'
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                    />
                    <span className='bi-search btn btn-dark' data-bs-dismiss='modal' onClick={handleAddCity}></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='input-group'>
            <span className='bi-geo-alt-fill btn btn-dark text-light'></span>
            <input
              type='text'
              placeholder='Search City OR zip,country'
              size={40}
              className='search'
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <span className='bi-search btn btn-dark' onClick={handleSearchCity}></span>
          </div>
          {/* Implemented darkmode and lightmode  */}
          <div className='form-switch'>
            <input
              type="checkbox"
              className='form-check-input bg-dark fs-4'
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </div>
        </header>
        <section>
          {/* weatehrDisplay is a function which return a container all city weather */}
          <main className='mt-2'>
            {weatherData ? (
              <WeatherDisplay data={weatherData} temp={temp} setTemp={setTemp} date={date} />
            ) : locationData ? (
              <WeatherDisplay data={locationData} temp={temp} setTemp={setTemp} date={date} />
            ) : (
              <div>Loading location...</div>
            )}
          </main>
          {/* this main section is displayed for show the all multiplecity weather  */}
          <main className='mt-2'>
            {cityArray.length > 0 && (
              <div className='MultLocation mt-2 p-2 rounded-4 {darkMode?bg-dark :bg-light}'>
                <button className='btn btn-light rounded-5'>Other Countries</button>
                <div className='multlocationmain'>
                  <div>
                    {cityArray.map((city, index) => (
                      <div key={city.id} className='mb-2 mt-2'>
                        <WeatherDisplay data={city} temp={temp} setTemp={setTemp} date={date} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </section>
      </div>
    </div>
  );
}

export default App;
