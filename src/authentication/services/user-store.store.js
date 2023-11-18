import { defineStore } from 'pinia';

export const useUserStore = defineStore('auth', {
    state: () => ({
        isCustomer: false,
        isEmployee: false,
        isAuthenticated: false,
        user: null,
    }),
    actions: {
        setUser(user) {
            this.isAuthenticated = true;
            user.email ? this.isCustomer=true : this.isEmployee=true;
            this.user = user;
        },
        logout() {
            localStorage.removeItem("user");
            this.isAuthenticated = false;
            this.isEmployee = false;
            this.isCustomer = false;
            this.user = null;
        },
    }
});