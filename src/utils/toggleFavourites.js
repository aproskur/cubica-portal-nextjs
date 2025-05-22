export const toggleFavorite = async (gameDocumentId, userDocumentId, token, isFavorite) => {
    try {
        const url = isFavorite
            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/favourites/remove`
            : `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/favourites/add`;


        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userDocumentId, gameDocumentId }) // Fix: Use document_id
        });


        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            throw new Error(`Failed to ${isFavorite ? "remove from" : "add to"} favorites`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
};





export const fetchFavorites = async (userDocumentId, token) => {
    try {

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

        const favoriteGameIds = data?.data?.map(fav => fav.gameDocumentId) || [];


        return favoriteGameIds;
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
    }
};







