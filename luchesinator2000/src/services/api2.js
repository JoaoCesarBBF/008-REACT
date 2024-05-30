import axios from 'axios';

//https://viacep.com.br/ws/13024100/json

const api = axios.create({
    baseURL: "http://api.weatherapi.com/v1/"
})

export default api;