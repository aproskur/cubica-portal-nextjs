// AuthContext manages the authentication state 
// Provides functions for login, registration, and logout.
// Manages login modal

"use client";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // for redirection
import { useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); // Store token in state (not in local storage as before)
    const [isLoading, setIsLoading] = useState(true); //Prevent unnecessary redirects
    const router = useRouter(); // For redirection
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [pendingPurchase, setPendingPurchase] = useState(false) //for keeping track of gamedata when a guest clicks on buy
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);

    const openProfileModal = () => setProfileModalOpen(true);
    const closeProfileModal = () => setProfileModalOpen(false);

    // After refreshing the page, React loses state. 
    // To keep the user logged in the following useEffect()  retrieves the token from localStorage:
    useEffect(() => {
        const storedToken = localStorage.getItem("jwt");

        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken); // Ensure fetchUser() is always called
        } else {
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {
    }, [isAuthenticated, user, token]);


    // When a user logs in or registers,  fetch their details using a stored token.
    // If a user has a valid JWT token, this function fetches their details from the Strapi API.
    const fetchUser = async (token) => {
        try {

            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const responseData = await response.json();

            if (!response.ok || !responseData.id) {
                throw new Error("Failed to fetch user");
            }

            // Store token in both `localStorage` and `useState`
            localStorage.setItem("jwt", token);
            setToken(token);

            setUser({
                id: responseData.id,
                documentId: responseData.documentId,
                username: responseData.username,
                email: responseData.email
            });

            setIsAuthenticated(true);

        } catch (error) {
            console.error("Error fetching user:", error);
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    };




    // When a user logs in, we send their credentials to Strapi and store the received JWT token.
    // Steps:
    // Sends login request with email and password.
    // If successful, saves the JWT token in localStorage.
    // Calls fetchUser() to get user details.
    // Redirects the user to /games/my.
    const login = async (identifier, password) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });

            const responseData = await response.json();

            if (!response.ok || !responseData.jwt) {
                throw new Error(responseData?.error?.message || "Invalid credentials");
            }

            localStorage.setItem("jwt", responseData.jwt);
            setToken(responseData.jwt);

            await fetchUser(responseData.jwt); // Ensure fetchUser() is awaited

        } catch (error) {
            console.error("Login error:", error);
            alert(error.message || "Login failed. Please check your credentials.");
        }
    };





    const handleLogout = () => {
        localStorage.removeItem("jwt"); // Remove token from storage
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);


        router.push("/"); // Redirect to homepage after logout
    };



    // When a user signs up, we send their username, email, and password to Strapi.
    //Steps:
    // Sends user details (username, email, password) to Strapi.
    // If successful, saves the JWT token in localStorage.
    // Calls fetchUser() to fetch user details.
    // Redirects the user to /games/my.
    const register = async (username, email, password) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const responseData = await response.json();

            if (!response.ok || !responseData.jwt) {
                throw new Error(responseData?.error?.message || "Registration failed.");
            }

            localStorage.setItem("jwt", responseData.jwt);
            setToken(responseData.jwt);

            await fetchUser(responseData.jwt); // Ensure the new user data is fetched

            //router.push("/games/my");
        } catch (error) {
            alert(error.message || "Registration failed. Please try again.");
        }
    };

    // Functions to control login modal
    const openLoginModal = () => {
        setLoginModalOpen(true);
    }
    const closeLoginModal = () => {
        setLoginModalOpen(false);
    }

    useEffect(() => {
    }, [isLoginModalOpen]);


    // Store game for purchase after login
    const requestLoginForPurchase = (game) => {
        setPendingPurchase(game);
        setLoginModalOpen(true);
    };


    useEffect(() => {
        if (isAuthenticated && isLoginModalOpen) {
            setLoginModalOpen(false);
        }
    }, [isAuthenticated, isLoginModalOpen]);




    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user, token, isLoading, login,
            handleLogout,
            register,
            openLoginModal,
            isLoginModalOpen,
            closeLoginModal,
            requestLoginForPurchase,
            pendingPurchase,
            isProfileModalOpen,
            openProfileModal,
            closeProfileModal,
        }}>
            {children}
        </AuthContext.Provider>
    );
};




export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};