import axios from 'axios';

const http = axios.create({
    baseURL: 'https://finance.zeabur.app/api/v1/'
});

export class HttpsService {
    getAll(endpoint) {
        return http.get(endpoint);
    }
}