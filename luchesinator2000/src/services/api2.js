import axios from 'axios';

const api = axios.create({
    baseURL: "http://api.weatherapi.com/v1/current.json",
    params: {
        key: '681e5c3595ee42c084a165140243005'
    }
})

export default api;