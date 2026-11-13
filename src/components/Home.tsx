import { useState } from "react";
import { Bookmark, Luggage, Plus, Settings } from "lucide-react";
import { C } from "../theme/colors";
import { SHADOW, primaryButton } from "../theme/tokens";
import type { HomeTab, Trip } from "../types";
import { SwipeableTripCard } from "./SwipeableTripCard";
import { TemplateView } from "./TemplateView";
import { Hint } from "./ui/Notes";
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

  const newTripButton = (
    <button onClick={onNew} className="press" style={primaryButton()}>
      <Plus size={18} /> Nuevo viaje
    </button>
  );

  return (
    <div className="anim-fade" style={{ padding: "calc(24px + env(safe-area-inset-top)) 22px 30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src="/pwa-192x192.png"
          alt=""
          width={48}
          height={48}
          style={{ borderRadius: "25.5%", boxShadow: SHADOW.logo }}
        />
        <div style={{ minWidth: 0 }}>
          <h1
            className="display"
            // Space Grotesk no tiene un peso mayor que 700: un trazo fino lo engorda un poco.
            style={{ margin: 0, fontSize: 28, lineHeight: 1.1, fontWeight: 700, color: C.ink, WebkitTextStroke: "0.35px currentColor" }}
          >
            Tralap
          </h1>
          <p style={{ margin: "2px 0 0", fontSize: 13.5, color: C.gray }}>
            Haz la maleta sin olvidar nada.
          </p>
        </div>
        <button
          onClick={onData}
          aria-label={backupDue ? "Ajustes: conviene guardar una copia" : "Ajustes"}
          title="Ajustes"
          className="press"
          style={{
            marginLeft: "auto",
            flexShrink: 0,
            position: "relative",
            width: 42,
            height: 42,
            borderRadius: 99,
            border: "none",
            background: C.mist,
            color: C.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Settings size={19} />
          {backupDue && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 11,
                height: 11,
                borderRadius: 99,
                background: C.rojo,
                border: `2px solid ${C.white}`,
              }}
            />
          )}
        </button>
      </div>

      <SegmentedTabs tabs={TABS} value={homeTab} onChange={setHomeTab} style={{ margin: "24px 0 20px" }} />

      {homeTab === "plantilla" ? (
        <TemplateView key="tpl" template={template} onAdd={onTplAdd} onRemove={onTplRemove} />
      ) : trips.length === 0 ? (
        <div key="vacio" className="anim-fade" style={{ textAlign: "center", padding: "36px 0 0" }}>
          <div
            style={{
              width: 76,
              height: 76,
              margin: "0 auto 18px",
              borderRadius: 99,
              background: C.mist,
              color: C.ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Luggage size={32} strokeWidth={1.6} />
          </div>
          <h2 className="display" style={{ margin: 0, fontSize: 21, fontWeight: 700, color: C.ink }}>
            Aún no tienes viajes
          </h2>
          <p style={{ margin: "8px auto 26px", maxWidth: 260, fontSize: 14, lineHeight: 1.5, color: C.gray, textWrap: "balance" }}>
            Crea el primero y Tralap preparará tu lista.
          </p>
          {newTripButton}
        </div>
      ) : (
        <div key="viajes" className="anim-fade">
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
          <div style={{ marginTop: 16 }}>{newTripButton}</div>
          <Hint style={{ margin: "14px 0 0" }}>
            Desliza una tarjeta a la izquierda para renombrar o eliminar
          </Hint>
        </div>
      )}
    </div>
  );
}
