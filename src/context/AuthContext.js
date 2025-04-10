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

    // After refreshing the page, React loses state. 
    // To keep the user logged in the following useEffect()  retrieves the token from localStorage:
    useEffect(() => {
        const storedToken = localStorage.getItem("jwt");

        if (storedToken) {
            console.log("Found stored JWT token:", storedToken);
            setToken(storedToken);
            fetchUser(storedToken); // Ensure fetchUser() is always called
        } else {
            console.log("No token found in local storage. User is not authenticated.");
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {
        console.log("Auth State Updated:", { isAuthenticated, user, token }); // Debug UI updates
    }, [isAuthenticated, user, token]);


    // When a user logs in or registers,  fetch their details using a stored token.
    // If a user has a valid JWT token, this function fetches their details from the Strapi API.
    const fetchUser = async (token) => {
        try {
            console.log("Fetching user with token:", token); // Debug token

            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const responseData = await response.json();
            console.log("Fetch User API Response:", responseData); // Debug user response

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

            console.log("User stored in context:", user); // Debug user state
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
            console.log("Login API Response:", responseData); // DEBUG

            if (!response.ok || !responseData.jwt) {
                throw new Error(responseData?.error?.message || "Invalid credentials");
            }

            console.log("Storing new JWT:", responseData.jwt);
            localStorage.setItem("jwt", responseData.jwt);
            setToken(responseData.jwt);

            await fetchUser(responseData.jwt); // Ensure fetchUser() is awaited

            console.log("User after login:", user); // DEBUG
        } catch (error) {
            console.error("Login error:", error);
            alert(error.message || "Login failed. Please check your credentials.");
        }
    };





    const handleLogout = () => {
        console.log("Logging out, clearing JWT token");
        localStorage.removeItem("jwt"); // Remove token from storage
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);

        console.log("JWT Cleared. Redirecting to home.");

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
            console.log("Register API Response:", responseData); // Debug response

            if (!response.ok || !responseData.jwt) {
                throw new Error(responseData?.error?.message || "Registration failed.");
            }

            console.log("Storing JWT after registration:", responseData.jwt);
            localStorage.setItem("jwt", responseData.jwt);
            setToken(responseData.jwt);

            await fetchUser(responseData.jwt); // Ensure the new user data is fetched

            console.log("User after registration:", user);
            //router.push("/games/my");
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.message || "Registration failed. Please try again.");
        }
    };

    // Functions to control login modal
    const openLoginModal = () => {
        console.log("openLoginModal() called (message from state)")
        setLoginModalOpen(true);
    }
    const closeLoginModal = () => {
        console.log("Cloelogin modal called (msg from state)");
        setLoginModalOpen(false);
    }

    useEffect(() => {
        console.log("Auth context: isLoginModalOpen=", isLoginModalOpen);
    }, [isLoginModalOpen]);


    // Store game for purchase after login
    const requestLoginForPurchase = (game) => {
        setPendingPurchase(game);
        setLoginModalOpen(true);
    };


    useEffect(() => {
        if (isAuthenticated && isLoginModalOpen) {
            console.log("User authenticated — closing login modal automatically.");
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
            pendingPurchase
        }}>
            {children}
        </AuthContext.Provider>
    );
};




export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        console.log("useAuth() called, context =", context); //
        console.log("ERROR: useAuth() is called outside of AuthProvider")
        throw new Error("useAuth must be used within an AuthProvider");
    }
    console.log("useAuth() called, context =", context); //
    return context;
};
