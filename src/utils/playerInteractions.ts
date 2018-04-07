export type PlayerXpInfo = {
    level: number;
    xp: number;
}

export function  getNextLevelXp(nextLevel: number): number {
    return Math.round(4 * Math.pow(nextLevel,3) / 5);
}

export function addXp(playerXpInfo: PlayerXpInfo, addingXp: number): PlayerXpInfo {
    if (addingXp < 0)
        return playerXpInfo;

    let level = playerXpInfo.level;
    let xp = playerXpInfo.xp;
    let leftXp = xp + addingXp;
    while(true) {
        let tmp = getNextLevelXp(++level);
        leftXp -= tmp;
        if (leftXp === 0)
            return {
                level,
                xp: 0,
            };
        if (leftXp < 0)
            return {
                level: level - 1,
                xp: tmp + leftXp,
            }
    }
}