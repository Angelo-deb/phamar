import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { today } from "../../lib/data";

export default function MiniChart({ movements }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const data = days.map((d) => ({
    name: new Date(d).toLocaleDateString("fr-FR", { weekday: "short" }),
    Entrées: movements
      .filter((m) => m.date === d && m.type === "in")
      .reduce((s, m) => s + m.qty, 0),
    Sorties: movements
      .filter((m) => m.date === d && m.type === "out")
      .reduce((s, m) => s + m.qty, 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} barSize={10} barGap={3}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={28} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,.08)" }}
          cursor={{ fill: "#f1f5f9" }}
        />
        <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Entrées" fill="#10b981" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Sorties" fill="#f87171" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
