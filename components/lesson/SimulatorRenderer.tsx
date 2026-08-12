"use client";

import ArraySimulator from "@/components/Simulators/ArraySimulator";
import BinarySearchSimulator from "@/components/Simulators/BinarySearchSimulator";
import BinarySimulator from "@/components/Simulators/BinarySimulator";
import BubbleSortSimulator from "@/components/Simulators/BubbleSortSimulator";
import CaesarCipherSimulator from "@/components/Simulators/CaesarCipherSimulator";
import CharacterEncodingSimulator from "@/components/Simulators/CharacterEncodingSimulator";
import CompressionSimulator from "@/components/Simulators/CompressionSimulator";
import CPUSimulator from "@/components/Simulators/CPUSimulator";
import CyberSecurityScenarioSimulator from "@/components/Simulators/CyberSecurityScenarioSimulator";
import DatabaseSimulator from "@/components/Simulators/DatabaseSimulator";
import DebuggingSimulator from "@/components/Simulators/DebuggingSimulator";
import DNSJourneySimulator from "@/components/Simulators/DNSJourneySimulator";
import EncryptionSimulator from "@/components/Simulators/EncryptionSimulator";
import EntityRelationshipSimulator from "@/components/Simulators/EntityRelationshipSimulator";
import FunctionSimulator from "@/components/Simulators/FunctionSimulator";
import HexSimulator from "@/components/Simulators/HexSimulator";
import ImageRepresentationSimulator from "@/components/Simulators/ImageRepresentationSimulator";
import IterationSimulator from "@/components/Simulators/IterationSimulator";
import LinearSearchSimulator from "@/components/Simulators/LinearSearchSimulator";
import LogicCircuitSimulator from "@/components/Simulators/LogicCircuitSimulator";
import LogicGateSimulator from "@/components/Simulators/LogicGateSimulator";
import MemorySimulator from "@/components/Simulators/MemorySimulator";
import MergeSortSimulator from "@/components/Simulators/MergeSortSimulator";
import NetworkBuilderSimulator from "@/components/Simulators/NetworkBuilderSimulator";
import NetworkTopologySimulator from "@/components/Simulators/NetworkTopologySimulator";
import OperatingSystemSimulator from "@/components/Simulators/OperatingSystemSimulator";
import PacketRoutingSimulator from "@/components/Simulators/PacketRoutingSimulator";
import PasswordSecuritySimulator from "@/components/Simulators/PasswordSecuritySimulator";
import ProtocolSimulator from "@/components/Simulators/ProtocolSimulator";
import PythonPlaygroundSimulator from "@/components/Simulators/PythonPlaygroundSimulator";
import SelectionSimulator from "@/components/Simulators/SelectionSimulator";
import SoundSamplingSimulator from "@/components/Simulators/SoundSamplingSimulator";
import SQLInjectionSimulator from "@/components/Simulators/SQLInjectionSimulator";
import SQLPlaygroundSimulator from "@/components/Simulators/SQLPlaygroundSimulator";
import StorageCapacitySimulator from "@/components/Simulators/StorageCapacitySimulator";
import StorageComparisonSimulator from "@/components/Simulators/StorageComparisonSimulator";
import TraceTableSimulator from "@/components/Simulators/TraceTableSimulator";
import TruthTableSimulator from "@/components/Simulators/TruthTableSimulator";
import VariablesSimulator from "@/components/Simulators/VariablesSimulator";
import BinaryAdditionSimulator from "@/components/Simulators/BinaryAdditionSimulator";
import BinaryShiftSimulator from "@/components/Simulators/BinaryShiftSimulator";
import InsertionSortSimulator from "@/components/Simulators/InsertionSortSimulator";
import QuickSortSimulator from "@/components/Simulators/QuickSortSimulator";
import FlowchartSimulator from "@/components/Simulators/FlowchartSimulator";

import type { SimulatorType } from "@/types/curriculum";

type SimulatorRendererProps = {
  simulator?: SimulatorType;
};

const simulatorLabels: Record<SimulatorType, string> = {
  binary: "Binary Simulator",
  hexadecimal: "Hexadecimal Simulator",
  "binary-addition": "Binary Addition Simulator",
  "binary-shift": "Binary Shift Simulator",
  "character-encoding": "Character Encoding Simulator",
  "image-representation": "Image Representation Simulator",
  "sound-sampling": "Sound Sampling Simulator",
  compression: "Compression Simulator",

  cpu: "CPU Simulator",
  memory: "Memory Simulator",
  "storage-capacity": "Storage Capacity Calculator",
  "storage-comparison": "Storage Device Comparison",
  "operating-system": "Operating System Simulator",

  "logic-gates": "Logic Gate Simulator",
  "truth-table": "Truth Table Simulator",
  "logic-circuit": "Logic Circuit Builder",

  "linear-search": "Linear Search Visualiser",
  "binary-search": "Binary Search Visualiser",
  "bubble-sort": "Bubble Sort Visualiser",
  "merge-sort": "Merge Sort Visualiser",
  "insertion-sort": "Insertion Sort Visualiser",
  "trace-table": "Trace Table Simulator",
  flowchart: "Flowchart Simulator",
  "quick-sort": "Quick Sort Visualiser",

  variables: "Variable Visualiser",
  selection: "Selection Visualiser",
  iteration: "Iteration Visualiser",
  arrays: "Array Visualiser",
  functions: "Function Visualiser",
  python: "Python Step-Through Playground",
  debugging: "Debugging Simulator",

  stack: "Stack Simulator",
  queue: "Queue Simulator",
  tree: "Tree Visualiser",
  graph: "Graph Visualiser",

  "network-builder": "Network Builder",
  "packet-routing": "Packet Routing Simulator",
  dns: "DNS Journey",
  protocols: "Network Protocol Simulator",
  "network-topology": "Network Topology Builder",

  encryption: "Encryption Simulator",
  "caesar-cipher": "Caesar Cipher Simulator",
  "password-security": "Password Security Simulator",
  cybersecurity: "Cybersecurity Scenario",
  "sql-injection": "SQL Injection Demonstration",

  database: "Database Simulator",
  sql: "SQL Playground",
  "entity-relationship": "Entity Relationship Designer",
};

function SimulatorComingSoon({ simulator }: { simulator: SimulatorType }) {
  return (
    <section className="rounded-3xl border border-dashed border-blue-300 bg-blue-50 p-8 text-center">
      <div className="text-5xl" aria-hidden="true">
        🧪
      </div>

      <p className="mt-5 text-sm font-black uppercase tracking-widest text-blue-600">
        Interactive simulator
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950">
        {simulatorLabels[simulator]}
      </h2>

      <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
        This simulator is registered and will become available when its
        curriculum unit is published.
      </p>
    </section>
  );
}

export default function SimulatorRenderer({
  simulator,
}: SimulatorRendererProps) {
  if (!simulator) {
    return null;
  }

  switch (simulator) {
    case "binary":
      return <BinarySimulator />;

    case "hexadecimal":
      return <HexSimulator />;

    case "cpu":
      return <CPUSimulator />;

    case "character-encoding":
      return <CharacterEncodingSimulator />;

    case "image-representation":
      return <ImageRepresentationSimulator />;

    case "sound-sampling":
      return <SoundSamplingSimulator />;

    case "compression":
      return <CompressionSimulator />;

    case "memory":
      return <MemorySimulator />;

    case "storage-capacity":
      return <StorageCapacitySimulator />;

    case "storage-comparison":
      return <StorageComparisonSimulator />;

    case "operating-system":
      return <OperatingSystemSimulator />;

    case "network-builder":
      return <NetworkBuilderSimulator />;

    case "network-topology":
      return <NetworkTopologySimulator />;

    case "protocols":
      return <ProtocolSimulator />;

    case "dns":
      return <DNSJourneySimulator />;

    case "packet-routing":
      return <PacketRoutingSimulator />;

    case "cybersecurity":
      return <CyberSecurityScenarioSimulator />;

    case "password-security":
      return <PasswordSecuritySimulator />;

    case "caesar-cipher":
      return <CaesarCipherSimulator />;

    case "encryption":
      return <EncryptionSimulator />;

    case "sql-injection":
      return <SQLInjectionSimulator />;

    case "linear-search":
      return <LinearSearchSimulator />;

    case "binary-search":
      return <BinarySearchSimulator />;

    case "bubble-sort":
      return <BubbleSortSimulator />;

    case "merge-sort":
      return <MergeSortSimulator />;

    case "trace-table":
      return <TraceTableSimulator />;

    case "flowchart":
      return <FlowchartSimulator />;

    case "variables":
      return <VariablesSimulator />;

    case "selection":
      return <SelectionSimulator />;

    case "iteration":
      return <IterationSimulator />;

    case "arrays":
      return <ArraySimulator />;

    case "functions":
      return <FunctionSimulator />;

    case "debugging":
      return <DebuggingSimulator />;

    case "python":
      return <PythonPlaygroundSimulator />;

    case "database":
      return <DatabaseSimulator />;

    case "sql":
      return <SQLPlaygroundSimulator />;

    case "entity-relationship":
      return <EntityRelationshipSimulator />;

    case "logic-gates":
      return <LogicGateSimulator />;

    case "truth-table":
      return <TruthTableSimulator />;

    case "logic-circuit":
      return <LogicCircuitSimulator />;

    case "binary-addition":
      return <BinaryAdditionSimulator />;

    case "binary-shift":
      return <BinaryShiftSimulator />;

    default:
      return <SimulatorComingSoon simulator={simulator} />;

    case "insertion-sort":
      return <InsertionSortSimulator />;

    case "quick-sort":
      return <QuickSortSimulator />;
  }
}
