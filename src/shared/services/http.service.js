import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:3000/api/v1/'
});

export class HttpsService {
    getAll(endpoint) {
        return http.get(endpoint);
    }

    create(endpoint, data) {
        return http.post(endpoint, data);
    }
}