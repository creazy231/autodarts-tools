import { AutodartsToolsConfig, AutodartsToolsCricketClosedPoints, AutodartsToolsMatchStatus,AutodartsToolsGlobalStatus } from "@/utils/storage";
import { AutodartsToolsCallerConfig } from "@/utils/callerStorage";
import { AutodartsToolsSoundsConfig } from "@/utils/soundsStorage";
import { playPointsSound, playSound } from "@/utils/playSound";
import { isCricket, isValidGameMode } from "@/utils/helpers";
import { soundsPlayer } from "@/entrypoints/match.content/soundsPlayer";

export async function sounds() {
  const config = await AutodartsToolsConfig.getValue();
  const isCallerEnabled = config.caller.enabled && isValidGameMode();
  const callerActive = (await AutodartsToolsCallerConfig.getValue()).caller.find(caller => caller.isActive);

  const globalStatus = await AutodartsToolsGlobalStatus.getValue();
  const soundConfig = await AutodartsToolsSoundsConfig.getValue();
  const matchStatus = await AutodartsToolsMatchStatus.getValue();
  const cricketClosedPoints = await AutodartsToolsCricketClosedPoints.getValue();

  let callerServerUrl = callerActive?.url || "";
  if (callerServerUrl.at(-1) !== "/") callerServerUrl += "/";
  const callerFileExt = callerActive?.fileExt || ".mp3";

  const turnPoints = matchStatus.turnPoints;
  const throwPointsArr = matchStatus.throws;
  const curThrowPointsName = throwPointsArr.slice(-1)[0];

  const playerEl = document.querySelector(".ad-ext-player-active .ad-ext-player-name");
  const playerName = playerEl && playerEl.innerText;

  const turnContainerEl = document.getElementById("ad-ext-turn");
  const letsGo = [...turnContainerEl?.querySelectorAll("div") as NodeListOf<HTMLElement>].filter(el => !el.classList.contains("ad-ext-turn-throw")).length === 4;

  if (!globalStatus.isFirstStart && letsGo && config.sounds.enabled && (soundConfig.playerStart?.data || soundConfig.playerStart?.info)) {
    const playerNameSoundPlayed = await soundsPlayer();
    if (playerNameSoundPlayed) {
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
    await playSound("playerStart", 2);
  }

  await AutodartsToolsGlobalStatus.setValue({ ...globalStatus, isFirstStart: false });
  
  let curThrowPointsNumber: number = -1;
  let curThrowPointsBed: string = "";
  let curThrowPointsMultiplier: number = 1;

  if (curThrowPointsName) {
    if (curThrowPointsName.startsWith("M")) {
      curThrowPointsNumber = 0;
      curThrowPointsBed = "Outside";
    } else if (curThrowPointsName === "BULL") {
      curThrowPointsNumber = 25;
      curThrowPointsBed = "D";
    } else if (curThrowPointsName === "25") {
      curThrowPointsNumber = 25;
      curThrowPointsBed = "S";
    } else {
      curThrowPointsNumber = Number.parseInt(curThrowPointsName.slice(1));
      curThrowPointsBed = curThrowPointsName.charAt(0);
    }

    if (curThrowPointsBed === "D") curThrowPointsMultiplier = 2;
    if (curThrowPointsBed === "T") curThrowPointsMultiplier = 3;
  }

  const isBot = curThrowPointsName?.length && playerName && playerName.startsWith("BOT LEVEL");
  if (isBot) {
    if (curThrowPointsBed === "Outside") {
      playSound("botOutside", 3);
    } else {
      playSound("bot", 3);
    }
  }

  setTimeout(async () => {
    if (turnPoints === "BUST") {
      if (soundConfig.bust?.data || soundConfig.bust?.info) {
        playSound("bust", 2);
      } else if (callerServerUrl.length && isCallerEnabled) {
        playPointsSound(callerServerUrl, callerFileExt, "0");
      }
    } else {
      if (curThrowPointsName === "BULL") {
        playSound("bull", 2);
      } else if (curThrowPointsBed === "Outside") {
        const missLength = soundConfig.miss.length;
        const randomMissCount = Math.floor(Math.random() * missLength);
        playSound("miss", 2, randomMissCount);
      } else if (curThrowPointsMultiplier === 3) { // Triple
        if (!(isCricket() && curThrowPointsNumber < 15)) {
          if (curThrowPointsNumber >= 15 && soundConfig[`T${curThrowPointsNumber}`].info.length) {
            playSound(`T${curThrowPointsNumber}`, 2);
          } else {
            playSound("T", 2);
          }
        }
      }

      /// ///////////// Cricket ////////////////////
      if (isCricket()) {
        if (curThrowPointsNumber >= 0) {
          if (curThrowPointsNumber >= 15 && !cricketClosedPoints.includes(curThrowPointsNumber)) {
            // setCricketClosedPoints();
            playSound("cricketHit", 3);
          } else {
            playSound("cricketMiss", 3);
          }
        }
      }

      if (isCallerEnabled && throwPointsArr.length === 3 && !(isCricket() && turnPoints === "0") && !matchStatus.isInEditMode && turnPoints !== "BUST" && callerServerUrl.length && callerFileExt.length) {
        playPointsSound(callerServerUrl, callerFileExt, turnPoints);
      }
    }
  }, isBot ? 500 : 0);
}