export const toggleFavorite = async (gameDocumentId, userDocumentId, token, isFavorite) => {
    try {
        const url = isFavorite
            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/favourites/remove`
            : `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/favourites/add`;

        console.log("Toggling favorite - Endpoint:", url);
        console.log("Sending request with:", { userDocumentId, gameDocumentId });

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userDocumentId, gameDocumentId }) // Fix: Use document_id
        });

        console.log("API Response Status:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            throw new Error(`Failed to ${isFavorite ? "remove from" : "add to"} favorites`);
        }

        const data = await response.json();
        console.log("API Success:", data);
        return data;
    } catch (error) {
        console.error("Error updating favorites:", error);
        return null;
    }
};





export const fetchFavorites = async (userDocumentId, token) => {
    try {
        console.log("Fetching favorites for user:", userDocumentId);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/favourites/${userDocumentId}?populate[games]=*`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();

        console.log("Fetched favorites data:", data);
        const favoriteGameIds = data?.data?.map(fav => fav.gameDocumentId) || [];


        console.log("Favorite game IDs:", favoriteGameIds);
        return favoriteGameIds;
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
};







