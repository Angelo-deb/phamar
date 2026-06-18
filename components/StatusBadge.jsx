import { Badge } from "./ui";
import { drugStatus } from "../lib/data";

const STATUS_MAP = {
  ok:       { variant: "green", label: "En stock"     },
  low:      { variant: "amber", label: "Stock faible" },
  out:      { variant: "red",   label: "Rupture"      },
  expired:  { variant: "red",   label: "Périmé"       },
  expiring: { variant: "amber", label: "Expire bientôt" },
};

export default function StatusBadge({ drug }) {
  const s = drugStatus(drug);
  const { variant, label } = STATUS_MAP[s];
  return <Badge variant={variant}>{label}</Badge>;
}
