import axios from 'axios';
import { OW_KEY } from './OWKey';

const OWServer = axios.create({
  baseURL: 'api.openweathermap.org/data/2.5/weather',
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
  const response = await OWServer.get(
    `?lat=${lat}&lon=${lon}&appid=${OW_KEY}`
  );
  console.log(response.data);
  callback(response.data);
};