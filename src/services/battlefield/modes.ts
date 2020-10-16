export const modes: Record<string, string> = {

}

/**
 * translates a game mode id to a readable name
 * @param id the game mode id to translate
 */
export const translate = (id: string) => id in modes ? modes[id] : id