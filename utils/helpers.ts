export const isX01 = () => document.getElementById("ad-ext-game-variant")?.textContent === "X01";
export const isBullOff = () => document.getElementById("ad-ext-game-variant")?.textContent === "Bull-off";
export const isCricket = () => document.getElementById("ad-ext-game-variant")?.textContent?.split(" ")[0] === "Cricket";

export const soundEffect1 = new Audio();
export const soundEffect2 = new Audio();
export const soundEffect3 = new Audio();
