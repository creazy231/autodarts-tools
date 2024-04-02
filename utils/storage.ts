import type { WxtStorageItem } from "wxt/storage";
import { storage } from "wxt/storage";
import type { BoardStatus } from "@/utils/types";

export interface IConfig {
  discord: {
    enabled: boolean;
    manually: boolean;
    url: string;
  };
  autoStart: {
    enabled: boolean;
  };
  streamingMode: {
    enabled: boolean;
    backgroundImage: boolean;
    chromaKeyColor: string;
    image: string;
    throws: boolean;
    footerText: string;
    board: boolean;
    boardImage: boolean;
    scoreBoardSettings: {
      scale: number;
      x: number;
      y: number;
    };
    coordsSettings: {
      scale: number;
      x: number;
      y: number;
    };
  };
  colors: {
    enabled: boolean;
    background: string;
    text: string;
  };
  recentLocalPlayers: {
    enabled: boolean;
    cap: number;
    players: string[];
  };
  takeout: {
    enabled: boolean;
  };
  inactiveSmall: {
    enabled: boolean;
  };
  shufflePlayers: {
    enabled: boolean;
  };
  caller: {
    enabled: boolean;
  };
  sounds: {
    enabled: boolean;
  };
  externalBoards: {
    enabled: boolean;
    boards: {
      id: string;
      name: string;
    }[];
  };
  tournaments: {
    enabled: boolean;
  };
}

export interface IMatchStatus {
  playerCount: number;
  throws: string[];
  turnPoints?: string ;
  isInEditMode: boolean;
  hasWinner: boolean;
}

export type TBoardStatus = BoardStatus | undefined;

export const defaultConfig: IConfig = {
  discord: {
    enabled: false,
    manually: false,
    url: "",
  },
  autoStart: {
    enabled: false,
  },
  streamingMode: {
    enabled: false,
    backgroundImage: false,
    chromaKeyColor: "#009933",
    image: "",
    throws: false,
    footerText: "",
    board: false,
    boardImage: false,
    scoreBoardSettings: {
      scale: 1,
      x: 0,
      y: 0,
    },
    coordsSettings: {
      scale: 1,
      x: 0,
      y: 0,
    },
  },
  colors: {
    enabled: false,
    background: "#3182CE",
    text: "#FFFFFF",
  },
  recentLocalPlayers: {
    enabled: false,
    cap: 10,
    players: [],
  },
  takeout: {
    enabled: false,
  },
  inactiveSmall: {
    enabled: false,
  },
  shufflePlayers: {
    enabled: false,
  },
  caller: {
    enabled: false,
  },
  sounds: {
    enabled: false,
  },
  externalBoards: {
    enabled: false,
    boards: [],
  },
  tournaments: {
    enabled: false,
  },
};

export const AutodartsToolsConfig: WxtStorageItem<IConfig, any> = storage.defineItem(
  "local:config",
  {
    defaultValue: defaultConfig,
  },
);

export const defaultMatchStatus: IMatchStatus = {
  playerCount: 0,
  throws: [],
  turnPoints: undefined,
  isInEditMode: false,
  hasWinner: false,
};

export const AutodartsToolsMatchStatus: WxtStorageItem<IMatchStatus, any> = storage.defineItem(
  "local:matchstatus",
  {
    defaultValue: defaultMatchStatus,
  },
);

export const AutodartsToolsBoardStatus: WxtStorageItem<TBoardStatus, any> = storage.defineItem(
  "local:boardstatus",
  {
    defaultValue: undefined,
  },
);

export const AutodartsToolsSoundAutoplayStatus: WxtStorageItem<boolean, any> = storage.defineItem(
  "local:soundstartstatus",
  {
    defaultValue: false,
  },
);

export const AutodartsToolsUrlStatus: WxtStorageItem<string, any> = storage.defineItem(
  "local:urlstatus",
  {
    defaultValue: window.location.href.split("#")[0],
  },
);

export const AutodartsToolsCricketClosedPoints: WxtStorageItem<number[], any> = storage.defineItem(
  "local:cricketpointsstatus",
  {
    defaultValue: [],
  },
);
