import dynamic from "next/dynamic";
import { useApp } from "../context/AppContext";
import { StatCard, Card, Badge, PageHeader } from "../components/ui";
import StatusBadge from "../components/StatusBadge";
import { drugStatus } from "../lib/data";

// Recharts uses browser APIs — disable SSR
const MiniChart = dynamic(() => import("../components/MiniChart"), { ssr: false });

export default function DashboardPage() {
  const { drugs, movements, currentUser } = useApp();

  const alerts    = drugs.filter((d) => ["low", "out", "expired", "expiring"].includes(drugStatus(d)));
  const expired   = drugs.filter((d) => drugStatus(d) === "expired");
  const totalVal  = drugs.reduce((s, d) => s + d.qty * d.price, 0);
  const recentMvt = [...movements].sort((a, b) => b.id - a.id).slice(0, 6);

  const dateLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        subtitle={`Bienvenue, ${currentUser.name} — ${dateLabel}`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Articles en stock"
          value={drugs.length}
          sub={`${drugs.filter((d) => d.qty > 0).length} disponibles`}
          color="green"
        />
        <StatCard
          label="Alertes actives"
          value={alerts.length}
          sub="stock faible + périmés"
          color={alerts.length > 0 ? "amber" : "default"}
        />
        <StatCard
          label="Articles périmés"
          value={expired.length}
          sub="à retirer immédiatement"
          color={expired.length > 0 ? "red" : "default"}
        />
        <StatCard
          label="Valeur du stock"
          value={totalVal.toLocaleString("fr-FR") + " FCFA"}
          sub="valeur totale estimée"
        />
      </div>

      {/* Charts + Recent */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Chart */}
        <Card className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Entrées / Sorties — 7 derniers jours
          </p>
          <MiniChart movements={movements} />
        </Card>

        {/* Recent movements */}
        <Card className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Derniers mouvements
          </p>
          {recentMvt.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">Aucun mouvement enregistré</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentMvt.map((m) => (
                <div key={m.id} className="flex items-center gap-3 py-2.5">
                  <Badge variant={m.type === "in" ? "green" : "red"} className="min-w-[52px] justify-center">
                    {m.type === "in" ? "Entrée" : "Sortie"}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.drugName}</p>
                    <p className="text-xs text-slate-400">{m.reason}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-semibold ${m.type === "in" ? "text-emerald-600" : "text-red-500"}`}>
                      {m.type === "in" ? "+" : "-"}{m.qty}
                    </p>
                    <p className="text-xs text-slate-400">{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Global alert */}
      {alerts.length > 0 && (
        <div className="mt-5 bg-amber-50 border border-amber-100 text-amber-700 text-sm px-4 py-3 rounded-lg">
          ⚠ {alerts.length} article(s) nécessitent votre attention (stock faible, rupture ou périmés).
        </div>
      )}
    </div>
  );
}
