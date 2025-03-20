import { useRouter } from "expo-router";

/**
 * Hook personnalisé pour gérer la navigation au jeu
 * Peut être utilisé dans n'importe quel composant, notamment HomeScreen
 */
export const useGameNavigation = () => {
  const router = useRouter();

  /**
   * Naviguer vers l'écran de jeu
   * @param options Options de démarrage du jeu
   */
  const navigateToGame = (options?: {
    level?: number; // Niveau de départ
    character?: string; // ID ou nom du personnage à rechercher
  }) => {
    const params = new URLSearchParams();

    if (options?.level) {
      params.append("level", options.level.toString());
    }

    if (options?.character) {
      params.append("character", options.character);
    }

    const queryString = params.toString();
    const path = queryString ? `/game?${queryString}` : "/game";

    router.push(path as any);
  };

  return { navigateToGame };
};
