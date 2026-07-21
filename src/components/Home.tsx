import { useState } from "react";
import { Bookmark, Luggage, Plus } from "lucide-react";
import { C } from "../theme/colors";
import type { HomeTab, Trip } from "../types";
import { SwipeableTripCard } from "./SwipeableTripCard";
import { TemplateView } from "./TemplateView";

interface HomeProps {
  trips: Trip[];
  template: string[];
  onOpen: (id: string) => void;
  onNew: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onTplAdd: (name: string) => void;
  onTplRemove: (name: string) => void;
}

export function Home({
  trips,
  template,
  onOpen,
  onNew,
  onRename,
  onDelete,
  onTplAdd,
  onTplRemove,
}: HomeProps) {
  const [homeTab, setHomeTab] = useState<HomeTab>("viajes");

  const tabs: { id: HomeTab; label: string; icon: typeof Luggage }[] = [
    { id: "viajes", label: "Mis viajes", icon: Luggage },
    { id: "plantilla", label: "Mi plantilla", icon: Bookmark },
  ];

  return (
    <div className="anim-fade" style={{ padding: "28px 24px 30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 13,
            background: C.negro,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Luggage size={22} color={C.marron} />
        </div>
        <h1 className="display" style={{ margin: 0, fontSize: 30, fontWeight: 700, color: C.negro }}>
          Tralap
        </h1>
      </div>
      <p style={{ margin: "6px 0 22px", fontSize: 14, color: C.gris }}>
        Haz la maleta sin olvidar nada.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {tabs.map((t) => {
          const active = homeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setHomeTab(t.id)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 0",
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 14.5,
                fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                border: `1px solid ${active ? C.negro : C.linea}`,
                background: active ? C.negro : C.blanco,
                color: active ? C.blanco : C.gris,
                boxShadow: active ? "0 4px 12px rgba(20,20,20,.22)" : "none",
                transform: active ? "translateY(-1px)" : "none",
                transition: "all .25s cubic-bezier(.22,1,.36,1)",
              }}
            >
              <t.icon size={16} color={active ? C.marron : undefined} /> {t.label}
            </button>
          );
        })}
      </div>

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
              style={{ fontSize: 12.5, fontWeight: 700, color: C.negro, letterSpacing: 1.5 }}
            >
              MIS VIAJES
            </span>
            <span style={{ fontSize: 12.5, color: C.grisSuave, fontWeight: 500 }}>
              {trips.length} activos
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
            <p
              style={{
                fontSize: 13.5,
                color: C.grisSuave,
                textAlign: "center",
                padding: "18px 0 10px",
              }}
            >
              Aún no tienes viajes. Crea el primero y Tralap preparará tu lista.
            </p>
          ) : (
            <p style={{ fontSize: 11.5, color: C.grisSuave, textAlign: "center", margin: "2px 0 10px" }}>
              Desliza una tarjeta hacia la izquierda para renombrar o eliminar
            </p>
          )}

          <button
            onClick={onNew}
            style={{
              width: "100%",
              padding: "16px 0",
              borderRadius: 16,
              border: `2px dashed ${C.grisSuave}`,
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 700,
              color: C.gris,
              fontFamily: "'Space Grotesk', sans-serif",
              transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.blanco;
              e.currentTarget.style.borderStyle = "solid";
              e.currentTarget.style.borderColor = C.marron;
              e.currentTarget.style.color = C.marron;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderStyle = "dashed";
              e.currentTarget.style.borderColor = C.grisSuave;
              e.currentTarget.style.color = C.gris;
            }}
          >
            <Plus size={18} /> Nuevo viaje
          </button>
        </div>
      )}
    </div>
  );
}
