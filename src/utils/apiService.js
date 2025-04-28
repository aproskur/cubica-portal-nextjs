import qs from "qs";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export const fetchGames = async ({ filters = {}, user = null } = {}) => {
    try {
        const query = qs.stringify(
            {
                filters: filters.onlyMyDevelopedGames && user
                    ? {
                        developed_by: {
                            id: {
                                $eq: user.id,
                            },
                        },
                    }
                    : {},
                populate: {
                    image: {
                        fields: ["url"],
                    },
                    images: {
                        fields: ["url"],
                    },
                    developed_by: {
                        fields: ["id", "username", "email"],
                    },
                },
            },
            { encodeValuesOnly: true }
        );

        const url = `${API_URL}/api/games?${query}`;
        console.log("Fetching games from:", url);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        return result.data.map((game) => {
            // cover image
            const image = game.image?.url
                ? game.image.url.startsWith("/")
                    ? `${API_URL}${game.image.url}`
                    : game.image.url
                : null;

            // swiper gallery
            const imageArray = Array.isArray(game.images)
                ? game.images.map((img, index) => ({
                    id: img.id ?? index,
                    url: img.url?.startsWith("/")
                        ? `${API_URL}${img.url}`
                        : img.url,
                }))
                : [];

            // developer
            const developer = game.developed_by
                ? {
                    id: game.developed_by.id,
                    username: game.developed_by.username,
                    email: game.developed_by.email,
                }
                : null;
            console.log("fetch all")
            return {
                documentId: game.documentId || game.id,
                title: game.title || "Untitled Game",
                slug: game.slug || "no-slug",
                image, // this was missing
                images: imageArray,
                rating: game.rating || 0,
                reviews: game.reviews || 0,
                pricePerLaunch: game.pricePerLaunch || 0,
                pricePerMonth: game.pricePerMonth || 0,
                pricePerDay: game.price_per_day || 0,
                description: game.description || "No description available.",
                developed_by: developer,
                is_published: game.is_published,
                purpose: game.game_purpose || null,
                plot: game.game_plot,
                genre: game.genre || "Unknown Genre",
                format: game.format || "Unknown Format",
                duration: game.duration || "Unknown Duration",
                author: game.author || "Unknown Author",
                about: game.about_author || "",
                support: game.game_support || "",
                reviews: game.reviews_tmp || "",
            };
        });
    } catch (error) {
        console.error("Error fetching games:", error);
        return [];
    }
};




/*

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
            developed_by: game.developed_by || "",
            is_published: game.is_published
        };
    } catch (error) {
        console.error("Error fetching game:", error);
        return null;
    }
};

*/

export const fetchGameBySlug = async (slug, token) => {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const url = `${baseUrl}/api/games/${slug}`;

    const res = await fetch(url, {
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
        },
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to fetch game");
    }

    console.log("FETCH GAME BY SLUG")

    const json = await res.json();
    const game = json.data;

    const baseURL = baseUrl.replace("/api", "");

    // Proper cover image
    const coverImage = game.image?.url
        ? game.image.url.startsWith("/")
            ? `${baseURL}${game.image.url}`
            : game.image.url
        : null;

    // Swiper image gallery
    const imageArray = Array.isArray(game.images)
        ? game.images.map((img) => ({
            id: img.id,
            url: img.url.startsWith("/") ? `${baseURL}${img.url}` : img.url,
        }))
        : [];

    return {
        ...game,
        image: coverImage,        // correct cover 
        images: imageArray,       // for Swiper
        purpose: game.game_purpose || [],
        plot: game.game_plot || [],
        about: game.about_author || "",
        support: game.game_support || "",
        reviews: game.reviews || "",
        tab_reviews: game.reviews_tmp || ""
    };
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


export const updateUserPassword = async (currentPassword, newPassword) => {
    try {
        const token = localStorage.getItem("jwt");
        if (!token) throw new Error("Требуется авторизация");

        const response = await fetch(`${API_URL}/api/users-permissions/user/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        });

        // fetch itself succeeded, but the server may return 4xx/5xx
        const data = await response.json();

        if (!response.ok) {
            const errorMessage =
                data?.error?.message ||
                data?.message ||
                "Ошибка при обновлении пароля";
            return { success: false, error: errorMessage };
        }

        return {
            success: true,
            message: data?.message || "Пароль успешно обновлён",
        };
    } catch (error) {
        // fetch failed — network error, CORS, etc.
        let fallbackMessage = "Ошибка сети. Проверьте соединение или попробуйте позже.";

        if (error instanceof TypeError && error.message === "Failed to fetch") {
            fallbackMessage = "Не удалось подключиться к серверу. Проверьте соединение.";
        }

        return {
            success: false,
            error: fallbackMessage,
        };
    }
};














// Fetch links for a user

