declare class Gradient {
  amp: number;
  seed: number;
  freqX: number;
  freqY: number;
  sectionColors: number[];

  initGradient(selector: string): this;
  pause(): void;
  play(): void;
  toggleColor(index: number): void;
  updateFrequency(freq: number): void;
}

export { Gradient };
