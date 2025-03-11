// AuthContext manages the authentication state 
// Provides functions for login, registration, and logout.

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


    // After refreshing the page, React loses state. 
    // To keep the user logged in the following useEffect()  retrieves the token from localStorage:
    useEffect(() => {
        const storedToken = localStorage.getItem("jwt");
        if (storedToken) {
            fetchUser(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        console.log("Auth State Updated:", { isAuthenticated, user, token }); // Debug UI updates
    }, [isAuthenticated, user, token]);


    // When a user logs in or registers, we fetch their details using a stored token.
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

            setUser({
                id: responseData.id,
                documentId: responseData.documentId,  // ✅ Store `documentId`, NOT `document_id`
                username: responseData.username,
                email: responseData.email
            });


            setIsAuthenticated(true);
            setToken(token);

            console.log("User stored:", responseData); // Debug user state
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

            console.log("Storing JWT:", responseData.jwt);
            localStorage.setItem("jwt", responseData.jwt);
            setToken(responseData.jwt);

            await fetchUser(responseData.jwt); // Ensure fetchUser() is awaited

            console.log("User after login:", user); // DEBUG
            //router.push("/games/my");
        } catch (error) {
            console.error("Login error:", error);
            alert(error.message || "Login failed. Please check your credentials.");
        }
    };




    const handleLogout = () => {
        localStorage.removeItem("jwt"); //  Remove token
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);

        //  If user is on a protected page, send them to home
        if (window.location.pathname !== "/") {
            router.push("/");
        }

        // If login modal is controlled by state, close modal here if needed
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
            router.push("/games/my");
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.message || "Registration failed. Please try again.");
        }
    };




    return (
        <AuthContext.Provider value={{ isAuthenticated, user, token, isLoading, login, handleLogout, register }}>
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
