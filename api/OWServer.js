import axios from 'axios';
import { OW_KEY } from './OWKey.js';

const OWServer = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/weather',
});

OWServer.interceptors.request.use(
  async (config) => {
    config.headers.Accept = 'application/json';
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export const getWeather = async (lat, lon, callback) => {
  const response = await OWServer.get(`?lat=${lat}&lon=${lon}&appid=${OW_KEY}&units=imperial`);
  callback({id: '' + response.data.id, icon: response.data.weather[0].icon, temperature: response.data.main.temp, description: response.data.weather[0].description});
};

export default OWServer;