import React, { useEffect, useState } from "react";
import WeatherInfo from "./WeatherInfo/WeatherInfo";
import WeatherForecast from "./WeatherForecast/WeatherForecast";
import WeatherSearch from "./WeatherSearch/WeatherSearch";
import "./Weather.css";
import axios from "axios";
import moment from "moment";

export default function Weather() {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({});

  const [unit, setUnit] = useState("imperial");

  useEffect(() => {
    search();
  }, []);

  function convertUnit() {
    let currentTemp;
    let currentWindSpeed;
    let convertedUnit;
    if (unit === "imperial") {
      //currentTemp is imperial
      //convert to metric
      currentTemp = Math.round((weatherData.temperature - 32) * (5 / 9));
      currentWindSpeed = Math.round(weatherData.wind * 1.609344);
      convertedUnit = "metric";
    } else {
      currentTemp = Math.round(weatherData.temperature * (9 / 5) + 32);
      currentWindSpeed = Math.round(weatherData.wind * 0.621371);
      convertedUnit = "imperial";
    }
    setWeatherData({
      ...weatherData,
      temperature: currentTemp,
      wind: currentWindSpeed,
      unit: convertedUnit,
    });
    setUnit(convertedUnit);
  }

  function handleResponse(response) {
    setWeatherData({
      temperature: Math.round(response.data.main.temp),
      wind: Math.round(response.data.wind.speed),
      city: response.data.name,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      date: moment(response.data.dt * 1000),
      icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
      unit: unit,
      coordinates: response.data.coord,
    });
  }

  async function search(city = "Irvine") {
    setLoading(true);
    const apiKey = "15b01518d9470d65eb96b19937333ceb";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    let weatherData = await axios.get(apiUrl);
    handleResponse(weatherData);
    setLoading(false);
  }

  function handleSubmit(event, city) {
    event.preventDefault();
    search(city);
  }

  if (loading) {
    return <div>Loading</div>;
  } else {
    return (
      <div className="Weather">
        <WeatherSearch handleSubmit={handleSubmit} />
        <WeatherInfo data={weatherData} convertUnit={convertUnit} />
        <WeatherForecast
          icon={weatherData.icon}
          coordinates={weatherData.coordinates}
          unit={unit}
        />
      </div>
    );
  }
}
