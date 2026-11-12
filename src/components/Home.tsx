import { useState } from "react";
import { Bookmark, Luggage, Plus, ShieldCheck } from "lucide-react";
import { C } from "../theme/colors";
import { FONT, SHADOW } from "../theme/tokens";
import type { HomeTab, Trip } from "../types";
import { countLabel } from "../utils/text";
import { SwipeableTripCard } from "./SwipeableTripCard";
import { TemplateView } from "./TemplateView";
import { EmptyText, Hint } from "./ui/Notes";
import { SegmentedTabs, type TabOption } from "./ui/SegmentedTabs";

interface HomeProps {
  trips: Trip[];
  template: string[];
  onOpen: (id: string) => void;
  onNew: () => void;
  /** Abre «Tus datos» (copias de seguridad). */
  onData: () => void;
  /** Hace tiempo (o nunca) que no se guarda una copia. */
  backupDue: boolean;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onTplAdd: (name: string) => boolean;
  onTplRemove: (name: string) => void;
}

const TABS: TabOption<HomeTab>[] = [
  { id: "viajes", label: "Mis viajes", icon: Luggage },
  { id: "plantilla", label: "Mi plantilla", icon: Bookmark },
];

export function Home({
  trips,
  template,
  onOpen,
  onNew,
  onData,
  backupDue,
  onRename,
  onDelete,
  onTplAdd,
  onTplRemove,
}: HomeProps) {
  const [homeTab, setHomeTab] = useState<HomeTab>("viajes");

  return (
    <div className="anim-fade" style={{ padding: "calc(28px + env(safe-area-inset-top)) 24px 30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <img
          src="/pwa-192x192.png"
          alt=""
          width={46}
          height={46}
          style={{ borderRadius: "25.5%", boxShadow: SHADOW.logo }}
        />
        <h1 className="display" style={{ margin: 0, fontSize: 30, fontWeight: 700, color: C.walnut }}>
          Tralap
        </h1>
        <button
          onClick={onData}
          aria-label={backupDue ? "Tus datos: conviene guardar una copia" : "Tus datos y copias de seguridad"}
          title="Tus datos"
          style={{
            marginLeft: "auto",
            position: "relative",
            width: 42,
            height: 42,
            borderRadius: 12,
            border: `1px solid ${C.taupe}`,
            background: C.white,
            color: C.walnut,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <ShieldCheck size={19} />
          {backupDue && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 10,
                height: 10,
                borderRadius: 99,
                background: C.rojo,
                border: `2px solid ${C.white}`,
              }}
            />
          )}
        </button>
      </div>
      <p style={{ margin: "6px 0 22px", fontSize: 14, color: C.walnut }}>
        Haz la maleta sin olvidar nada.
      </p>

      <SegmentedTabs tabs={TABS} value={homeTab} onChange={setHomeTab} style={{ marginBottom: 18 }} />

      {homeTab === "plantilla" ? (
        <TemplateView key="tpl" template={template} onAdd={onTplAdd} onRemove={onTplRemove} />
      ) : (
        <div key="viajes" className="anim-fade">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <span
              className="display"
              style={{ fontSize: 12.5, fontWeight: 700, color: C.walnut, letterSpacing: 1.5 }}
            >
              MIS VIAJES
            </span>
            <span style={{ fontSize: 12.5, color: C.walnut, fontWeight: 500 }}>
              {countLabel(trips.length, "activo", "activos")}
            </span>
          </div>

          {trips.map((trip, i) => (
            <SwipeableTripCard
              key={trip.id}
              trip={trip}
              index={i}
              onOpen={() => onOpen(trip.id)}
              onRename={(name) => onRename(trip.id, name)}
              onDelete={() => onDelete(trip.id)}
            />
          ))}

          {trips.length === 0 ? (
            <EmptyText style={{ padding: "18px 0 10px" }}>
              Aún no tienes viajes. Crea el primero y Tralap preparará tu lista.
            </EmptyText>
          ) : (
            <Hint style={{ margin: "2px 0 10px" }}>
              Desliza una tarjeta a la izquierda para renombrar o eliminar
            </Hint>
          )}

          <button
            onClick={onNew}
            style={{
              width: "100%",
              padding: "16px 0",
              borderRadius: 16,
              border: `2px dashed ${C.mocha}`,
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 700,
              color: C.walnut,
              fontFamily: FONT.display,
              transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.white;
              e.currentTarget.style.borderStyle = "solid";
              e.currentTarget.style.borderColor = C.walnut;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderStyle = "dashed";
              e.currentTarget.style.borderColor = C.mocha;
            }}
          >
            <Plus size={18} /> Nuevo viaje
          </button>
        </div>
      )}
    </div>
  );
}
