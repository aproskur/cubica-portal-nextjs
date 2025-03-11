import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api"; // Adjust for deployed backend

// Register a new user (only using email and password for authentication)
export const registerUser = async (email, password, username) => {
    try {
        const response = await axios.post(`${API_URL}/auth/local/register`, {
            email,
            password,
            username, // Username is stored, but not used for authentication
        });

        // Store JWT token and user details in localStorage
        localStorage.setItem("token", response.data.jwt);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return response.data;
    } catch (error) {
        throw error.response?.data || "Registration failed.";
    }
};

// Login user (using only email and password)
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/local`, {
            identifier: email, // Strapi uses "identifier" for email or username; here it's email
            password,
        });

        // Store JWT token and user details in localStorage
        localStorage.setItem("token", response.data.jwt);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return response.data;
    } catch (error) {
        throw error.response?.data || "Login failed.";
    }
};

// Logout user
export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

// Get logged-in user from localStorage
export const getUser = () => {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
    return null;
};
