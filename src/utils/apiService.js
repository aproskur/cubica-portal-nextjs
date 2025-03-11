
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
                id: game.documentId || 0,
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
            id: game.documentId || 0,
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
        const url = "http://localhost:1337/api/purchases/my";
        console.log("Fetching purchases from:", url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Response Status:", response.status);
        const data = await response.json();
        console.log("API Response:", data);
        console.log("Purchases API Response:", JSON.stringify(data, null, 2));




        if (!response.ok) {
            throw new Error(`API Error! Status: ${response.status} - ${data?.error?.message || "No message"}`);
        }

        return data;
    } catch (error) {
        console.error("Error fetching purchases:", error);
        return null;
    }
};





// Fetch links for a user

