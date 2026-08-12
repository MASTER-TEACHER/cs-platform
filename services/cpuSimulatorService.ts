import type {
  CPUCycleStage,
  CPUCycleStep,
  CPUMemoryLocation,
  CPURegisters,
} from "@/types/cpuSimulator";

export const initialCPURegisters: CPURegisters = {
  PC: 0,
  MAR: 0,
  MDR: "",
  CIR: "",
  ACC: 0,
};

export const cpuMemory: CPUMemoryLocation[] = [
  {
    address: 0,
    instruction: "LOAD 5",
    description: "Load the value 5 into the accumulator.",
  },
  {
    address: 1,
    instruction: "ADD 3",
    description: "Add the value 3 to the accumulator.",
  },
  {
    address: 2,
    instruction: "STORE 8",
    description: "Store the accumulator value at memory address 8.",
  },
  {
    address: 3,
    instruction: "SUB 2",
    description: "Subtract 2 from the accumulator.",
  },
];

export const cpuCycleSteps: CPUCycleStep[] = [
  {
    stage: "ready",
    title: "Ready",
    explanation:
      "The program counter stores the address of the next instruction.",
    activeRegisters: ["PC"],
  },
  {
    stage: "pc-to-mar",
    title: "Copy PC to MAR",
    explanation:
      "The address held in the program counter is copied into the memory address register.",
    activeRegisters: ["PC", "MAR"],
  },
  {
    stage: "memory-to-mdr",
    title: "Fetch from memory",
    explanation:
      "The instruction stored at the address in the MAR is fetched from memory and copied into the MDR.",
    activeRegisters: ["MAR", "MDR"],
  },
  {
    stage: "mdr-to-cir",
    title: "Copy MDR to CIR",
    explanation:
      "The fetched instruction is copied from the memory data register into the current instruction register.",
    activeRegisters: ["MDR", "CIR"],
  },
  {
    stage: "increment-pc",
    title: "Increment PC",
    explanation:
      "The program counter is increased so that it points to the next instruction.",
    activeRegisters: ["PC"],
  },
  {
    stage: "decode",
    title: "Decode",
    explanation:
      "The control unit decodes the instruction in the current instruction register.",
    activeRegisters: ["CIR"],
  },
  {
    stage: "execute",
    title: "Execute",
    explanation:
      "The processor carries out the decoded instruction. The accumulator may store the result.",
    activeRegisters: ["CIR", "ACC"],
  },
  {
    stage: "complete",
    title: "Cycle complete",
    explanation:
      "The instruction has been executed. The processor is ready to fetch the next instruction.",
    activeRegisters: ["PC", "ACC"],
  },
];

export function getCycleStep(stage: CPUCycleStage): CPUCycleStep {
  return cpuCycleSteps.find((step) => step.stage === stage) ?? cpuCycleSteps[0];
}

export function getMemoryInstruction(address: number): string {
  return (
    cpuMemory.find((location) => location.address === address)?.instruction ??
    "NO INSTRUCTION"
  );
}

export function executeInstruction(
  instruction: string,
  accumulator: number,
): number {
  const [operation, rawValue] = instruction.split(" ");
  const value = Number(rawValue);

  if (!Number.isFinite(value)) {
    return accumulator;
  }

  if (operation === "LOAD") {
    return value;
  }

  if (operation === "ADD") {
    return accumulator + value;
  }

  if (operation === "SUB") {
    return accumulator - value;
  }

  return accumulator;
}
