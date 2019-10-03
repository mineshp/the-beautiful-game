import axios from 'axios';
import config from '../config';

const handleError = (err) => {
  console.log(err);
  throw err
};

const get = (url) => axios.get(`${config.API_URL}${url}`).catch(handleError);

const post = (url, body) => axios.post(`${config.API_URL}${url}`, body).catch(handleError);

const put = (url, body) => axios.put(`${config.API_URL}${url}`, body);

const del = (url, body) => axios.delete(`${config.API_URL}${url}`, { data: body });

export default {
  get,
  post,
  put,
  delete: del
};