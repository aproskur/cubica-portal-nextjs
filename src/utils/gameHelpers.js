import { handleGameUpdate } from "@/utils/apiService";

/**
 * Unified function to update a game in backend, context, and local state.
 */
export const saveAndUpdateGame = async (
    fieldsToUpdate,
    {
        game,
        token,
        updateGameInList,
        setLocalGame,
        onSuccess,
        onError,
    }
) => {
    try {
        // Call API and get the full updated game object back
        const response = await handleGameUpdate(game.documentId, fieldsToUpdate, token);
        const updated = response.data; // unwrap it

        // Update global context
        if (updateGameInList) {
            updateGameInList(updated);;
        }

        // Update local state (optional)
        if (setLocalGame) {
            setLocalGame((prev) => ({ ...prev, ...updated }));
        }

        // Trigger optional callback
        if (onSuccess) onSuccess();

        return updated;
    } catch (err) {
        console.error("Ошибка при обновлении игры:", err);
        if (onError) onError(err);
    }
};
