import qs from "qs";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";


export const fetchGames = async () => {
    try {
        // Query to explicitly populate image and developed_by
        const query = qs.stringify(
            {
                populate: {
                    image: {
                        fields: ['url'],
                    },
                    developed_by: {
                        populate: true,
                        fields: ['username', 'email'],
                    },
                },
            },
            {
                encodeValuesOnly: true,
            }
        );

        const url = `${API_URL}/api/games?${query}`;
        console.log("Fetching games from:", url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        return result.data.map((game, index) => {

            console.log(`Game #${index + 1} - developed_by:`, game.developed_by);
            // Safe image URL logic
            const imageUrl = game.image?.url
                ? game.image.url.startsWith('/')
                    ? `${API_URL}${game.image.url}`
                    : game.image.url
                : null;

            // Safe developer info
            const developer = game.developed_by
                ? {
                    id: game.developed_by.id,
                    username: game.developed_by.username,
                    email: game.developed_by.email,
                }
                : null;

            return {
                documentId: game.documentId || game.id,
                title: game.title || "Untitled Game",
                slug: game.slug || "no-slug",
                image: imageUrl,
                rating: game.rating || 0,
                reviews: game.reviews || 0,
                pricePerLaunch: game.pricePerLaunch || 0,
                pricePerMonth: game.pricePerMonth || 0,
                description: game.description || "No description available.",
                developed_by: developer,
            };
        });
    } catch (error) {
        console.error("❌ Error fetching games:", error);
        return [];
    }
};




//Fetching data for 1 game (by slug)
export const fetchGameBySlug = async (slug) => {
    try {
        const response = await fetch(`${API_URL}/api/games?filters[slug][$eq]=${slug}&populate=*`);


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();


        if (!data || !data.data || !data.data.length) {
            throw new Error("Game not found");
        }

        const game = data.data[0]
        console.log("Game full entry:", data.data[0]);


        let baseURL = API_URL.endsWith('/api') ? API_URL.replace('/api', '') : API_URL;
        let imageUrl = game.image?.url ? `${baseURL}${game.image.url}` : "/default.jpg";

        return {
            documentId: game.documentId || 0,
            title: game.title || "Untitled Game",
            slug: game.slug || "no-slug",
            image: imageUrl,
            rating: game.rating || 0,
            reviews: game.reviews || 0,
            pricePerLaunch: game.pricePerLaunch || 0,
            pricePerMonth: game.pricePerMonth || 0,
            description: game.description || "No description available.",
            genre: game.genre || "Unknown Genre",
            format: game.format || "Unknown Format",
            duration: game.duration || "Unknown Duration",
            author: game.author || "Unknown Author",
            images: game.images || [],
            purpose: game.game_purpose || [],
            plot: game.game_plot || [],
            about: game.about_author || "",
            support: game.game_support || "",
            reviews: game.reviews_tmp || "",
            developed_by: game.developed_by || ""
        };
    } catch (error) {
        console.error("Error fetching game:", error);
        return null;
    }
};



// Fetch purchases for a user
export const fetchUserPurchases = async () => {
    try {
        const token = localStorage.getItem("jwt");

        if (!token) {
            console.error("No token found! User might not be authenticated.");
            return null;
        }

        console.log("Fetching user purchases with token:", token);

        const response = await fetch(`${API_URL}/api/purchases`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Response Status:", response.status);

        const data = await response.json();
        console.log("Purchases API Response:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            console.error("API Error:", data || "No error message in response");
            throw new Error(`API Error! Status: ${response.status} - ${data?.error?.message || "No message"}`);
        }

        return data.purchases; // Ensure it returns only purchases array
    } catch (error) {
        console.error("Error fetching purchases:", error);
        return null;
    }
};

export const createOrder = async (gameDocumentId, packageType, startDate, endDate, price) => {
    try {
        const token = localStorage.getItem("jwt")
        if (!token) throw new Error("Authentication required");

        const response = await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ gameDocumentId, packageType, startDate, endDate, price })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error_code || "ORDER_CREATION_FAILED");
        }
        return { success: true, order: data.order };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: error.message };
    }
};

// Update order status
export const updateOrderStatus = async (orderDocumentId, status) => {
    try {
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("Authentication required");

        const response = await fetch(`${API_URL}/api/orders/${orderDocumentId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ orderDocumentId, status })
        });

        const data = await response.json();
        if (!response.ok) throw new Error("ORDER_UPDATE_FAILED");

        return { success: true, data };
    } catch (error) {
        console.error("Error updating order status:", error);
        return { success: false, error: error.message };
    }
};


export const createPurchase = async (orderDocumentId) => {
    try {
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("Authentication required");

        const response = await fetch(`${API_URL}/api/purchases`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                data: {
                    documentId: orderDocumentId  // This must match the expected key in Strapi 5
                }
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "PURCHASE_CREATION_FAILED");

        return { success: true, data };
    } catch (error) {
        console.error("Error creating purchase:", error);
        return { success: false, error: error.message };
    }
};


// for testing, used in ROBOKASSA button
export const testRobokassaLink = async () => {
    try {
        const token = localStorage.getItem("jwt");

        const res = await fetch("http://localhost:1337/api/robokassa/payment-link?documentId=test123", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const data = await res.json();
        console.log("Backend response:", data);
    } catch (err) {
        console.error("Error fetching robokassa link:", err);
    }
};


export const getRobokassaPaymentLink = async (orderDocumentId) => {
    try {
        const token = localStorage.getItem("jwt");

        const res = await fetch(`${API_URL}/api/robokassa/payment-link?documentId=${orderDocumentId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data?.message || "Failed to get Robokassa link");

        return { success: true, url: data.url };
    } catch (error) {
        console.error("Robokassa link error:", error);
        return { success: false, error: error.message };
    }
};





export const handleGameUpdate = async (documentId, data, token) => {
    if (!token) {
        throw new Error("Missing or invalid credentials");
    }

    try {
        const res = await fetch(`${API_URL}/api/games/${documentId}/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result?.error?.message || "Failed to update game");
        }

        return result;
    } catch (error) {
        console.error("Ошибка при обновлении игры:", error);
        throw error;
    }
};














// Fetch links for a user

