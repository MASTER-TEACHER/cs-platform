import BinarySimulator from "@/components/Simulators/BinarySimulator";
import HexSimulator from "@/components/Simulators/HexSimulator";
import { SimulatorType } from "@/types/curriculum";

type Props = {
  simulator?: SimulatorType;
};

export default function SimulatorRenderer({ simulator }: Props) {
  if (!simulator) return null;

  if (simulator === "binary") {
    return <BinarySimulator />;
  }

  if (simulator === "hexadecimal") {
    return <HexSimulator />;
  }

  return null;
}