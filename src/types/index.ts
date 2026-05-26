export interface SymbolConfig {
  image: string;
  value: number;
}

export interface Theme {
  siteName: string;
  currencyName: string;
  background: string;
  symbols: Record<string, SymbolConfig>;
  text: Record<string, string>;
}

export interface GameState {
  balance: number;
  currentBet: number;
  isSpinning: boolean;
  reels: string[][];
}
