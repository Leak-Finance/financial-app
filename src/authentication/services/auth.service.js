import axios from "axios";

const http = axios.create({
    baseURL: 'http://localhost:3000/api/v1/'
});
export class AuthService {
    signUpCustomers(email, password, dni, firstName, lastName, phoneNumber) {
        return http.post('security/auth/customers/sign-up', {
            email: email,
            password: password,
            dni: dni,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber
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

    signInEmployees(email, password) {
        return http.post('security/auth/employees/sign-in', {
            email: email,
            password: password
        })
    }

    logout() {
        localStorage.removeItem('user');
    }
}