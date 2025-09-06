/// <reference types="vite/client" />

import type { Sunglasses } from './types/sunglasses';

declare global {
  interface Window {
    globalSunglasses: Sunglasses[];
    globalSunglassesLoaded: boolean;
  }
}
