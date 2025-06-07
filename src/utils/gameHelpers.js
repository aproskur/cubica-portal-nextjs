import { handleGameUpdate, fetchGameBySlug } from '@/utils/apiService';

// Utility: convert camelCase keys to snake_case
const toSnakeCase = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
      value,
    ])
  );

export const saveAndUpdateGame = async (
  fieldsToUpdate,
  { game, token, updateGameInList, setLocalGame, onSuccess, onError }
) => {
  try {
    const fieldsForBackend = toSnakeCase(fieldsToUpdate); // <-- FIX

    await handleGameUpdate(game.documentId, fieldsForBackend, token);

    const fullGame = await fetchGameBySlug(game.slug, token);
    if (!fullGame) throw new Error('Could not refetch full game data');

    if (updateGameInList) updateGameInList(fullGame);
    if (setLocalGame) setLocalGame(fullGame);
    if (onSuccess) onSuccess();

    return fullGame;
  } catch (err) {
    console.error('Ошибка при обновлении игры:', err);
    if (onError) onError(err);
    return null;
  }
};
