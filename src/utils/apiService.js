
// Fetch all games

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Fetch all games and prevent undefined errors
export const fetchGames = async () => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
        console.log("Fetching games from:", `${API_URL}/api/games?populate=*`);

        const response = await fetch(`${API_URL}/api/games?populate=*`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Full API Response:", JSON.stringify(data, null, 2)); //Debug API response
        console.log("Raw Game Data from Strapi:", JSON.stringify(data, null, 2));


        if (!data || !data.data) {
            throw new Error("Invalid API response structure");
        }

        return data.data.map((game) => {
            console.log("Processing Game:", game); // Log each game object

            // Debug game properties to check structure
            if (!game || typeof game !== "object") {
                console.error("Invalid game object:", game);
                return null;
            }

            return {
                documentId: game.documentId || 0,
                title: game.title || "Untitled Game",
                slug: game.slug || "no-slug",
                image: game.image?.url || "/default.jpg", // Fix image reference
                rating: game.rating || 0,
                reviews: game.reviews || 0,
                pricePerLaunch: game.pricePerLaunch || 0,
                pricePerMonth: game.pricePerMonth || 0,
                description: game.description || "No description available."
            };
        }).filter(Boolean); // Remove `null` entries
    } catch (error) {
        console.error("Error fetching games:", error);
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

        if (!data || !data.data.length) {
            throw new Error("Game not found");
        }

        const game = data.data[0]; // Get first (and only) game result

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













// Fetch links for a user

