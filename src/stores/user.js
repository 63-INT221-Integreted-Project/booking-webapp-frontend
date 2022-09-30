import { defineStore } from "pinia";
import dayjs from "dayjs";
import AuthService from "../services/auth.service";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
        token: null,
    }),
    actions: {
        async fetchUser() {
            try {
                let user = await AuthService.fetchProfile();
                this.user = { ...user };
            } catch (error) {}
        },
        getUserRole() {
            try {
                return this.user.role;
            } catch (error) {
                return "";
            }
        },
        getUserName() {
            try {
                return this.user.name;
            } catch (error) {
                return "";
            }
        },
        getUserEmail() {
            try {
                return this.user.email;
            } catch (error) {
                return "";
            }
        },
        isAdmin() {
            return this.user?.role === "admin" || false;
        },
        isStudent() {
            return this.user?.role === "student" || false;
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem("access_token");
            window.location.reload();
        },
    },
});
