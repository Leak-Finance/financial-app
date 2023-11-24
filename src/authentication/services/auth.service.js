import axios from "axios";

const http = axios.create({
    baseURL: 'https://finance.zeabur.app/api/v1'
});
export class AuthService {
    signUpCustomers(email, password, dni, firstName, lastName, phoneNumber, photoUrl) {
        return http.post('security/auth/customers/sign-up', {
            email: email,
            password: password,
            dni: parseInt(dni),
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            photoUrl: photoUrl
        })
    }

    signUpEmployees(username, password, firstName, lastName) {
        return http.post('security/auth/customers/sign-up', {
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName
        })
    }

    signInCustomers(email, password) {
        return http.post('security/auth/customers/sign-in', {
            email: email,
            password: password
        })
    }

    signInEmployees(username, password) {
        return http.post('security/auth/employees/sign-in', {
            username: username,
            password: password
        })
    }

    logout() {
        localStorage.removeItem('user');
    }
}