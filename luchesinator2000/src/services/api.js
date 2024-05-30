import axios from 'axios';

//https://viacep.com.br/ws/13024100/json

const api = axios.create({
    baseURL: "https://cep.awesomeapi.com.br/json/"
})

export default api;