import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:3000/'
});

export class VehicleRetailService {
    // Vehicles
    getAllVehicles() {
        return http.get('api/v1/vehicle-retail/vehicles');
    }
    getVehicleById(id) {
        return http.get(`api/v1/vehicle-retail/vehicles/${id}`);
    }

    createVehicle(model, manufactureYear, photoUrl, brandId) {
        return http.post(`api/v1/vehicle-retail/vehicles/brand/${brandId}`, {
            model: model,
            manufactureYear: manufactureYear,
            photoUrl: photoUrl
        });
    }

    // Posts
    getAllVehiclePosts() {
        return http.get('api/v1/vehicle-retail/vehicle-posts');
    }
    getVehiclePostById(id) {
        return http.get(`api/v1/vehicle-retail/vehicle-posts/${id}`);
    }
    createVehiclePost(description, price, createdByEmployeeProfileId, vehicleId, currencyId) {
        return http.post('api/v1/vehicle-retail/vehicle-posts', {
            description: description,
            price: price,
            createdByEmployeeProfileId: createdByEmployeeProfileId,
            vehicleId: vehicleId,
            currencyId: currencyId
        });
    }
    updateVehiclePost(id, updatedVehiclePost) {
        return http.put(`api/v1/vehicle-retail/vehicle-posts/${id}`, updatedVehiclePost);
    }
    deleteVehiclePost(id) {
        window.location.reload();
        return http.delete(`api/v1/vehicle-retail/vehicle-posts/${id}`);
    }

    // Vehicle Brands
    getVehicleBrandById(id) {
        return http.get(`api/v1/vehicle-retail/vehicle-brands/${id}`);
    }
    getAllVehicleBrands() {
        return http.get('api/v1/vehicle-retail/vehicle-brands');
    }


    // Currencies
    getAllCurrencies() {
        return http.get('api/v1/vehicle-retail/currencies');
    }
    getCurrencyById(id) {
        return http.get(`api/v1/vehicle-retail/currencies/${id}`);
    }
}