import axios from 'axios';

export const cepApiClient = axios.create({
    baseURL: "https://cep.awesomeapi.com.br/json/"
})
