import { handleGameUpdate, fetchGameBySlug } from '@/utils/apiService';

export const saveAndUpdateGame = async (
  fieldsToUpdate,
  { game, token, updateGameInList, setLocalGame, onSuccess, onError }
) => {
  try {
    await handleGameUpdate(game.documentId, fieldsToUpdate, token);

    // Refetch complete data to ensure competencies/images/relations are included
    const fullGame = await fetchGameBySlug(game.slug, token);

    if (!fullGame) throw new Error('Could not refetch full game data');

    const fullGameWithFixedPrices = {
      ...fullGame,
      pricePerDay: fullGame.price_per_day ?? fullGame.pricePerDay,
    };

    if (updateGameInList) updateGameInList(fullGameWithFixedPrices);
    if (setLocalGame) setLocalGame(fullGameWithFixedPrices);
    if (onSuccess) onSuccess();

    return fullGameWithFixedPrices;
  } catch (err) {
    console.error('Ошибка при обновлении игры:', err);
    if (onError) onError(err);
    return null;
  }
};
