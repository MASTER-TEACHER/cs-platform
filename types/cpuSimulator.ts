export type CPUCycleStage =
  | "ready"
  | "pc-to-mar"
  | "memory-to-mdr"
  | "mdr-to-cir"
  | "increment-pc"
  | "decode"
  | "execute"
  | "complete";

export type CPURegisterName = "PC" | "MAR" | "MDR" | "CIR" | "ACC";

export type CPURegisters = {
  PC: number;
  MAR: number;
  MDR: string;
  CIR: string;
  ACC: number;
};

export type CPUMemoryLocation = {
  address: number;
  instruction: string;
  description: string;
};

export type CPUCycleStep = {
  stage: CPUCycleStage;
  title: string;
  explanation: string;
  activeRegisters: CPURegisterName[];
};
