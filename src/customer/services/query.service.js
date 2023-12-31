import axios from 'axios';

const http = axios.create({
    baseURL: 'https://finance.zeabur.app/'
});

export class QueryService {
    // Vehicles
    createQuerie(email, parameters) {
        return http.post(`api/v1/buy-queries`, {
            email: email,
            parameters: parameters,
        });
    }
    getAllQueries() {
        return http.get('api/v1/buy-queries');
    }
}