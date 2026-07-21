import React, { useState, useRef } from "react";
import {
  Luggage, Plus, Sun, Mountain, Building2, Briefcase,
  Check, ChevronLeft, Shirt, FileText, Sparkles, X, Calendar,
  Pencil, Trash2, Bookmark, Footprints, Dumbbell, PartyPopper,
  Camera, Laptop, Waves, Undo2, Search
} from "lucide-react";

/* ============ PALETA — blanco / gris claro / negro + acentos marrón ============ */
const C = {
  negro:    "#141414",   // superficies fuertes y texto principal
  gris:     "#55555A",   // texto secundario
  grisSuave:"#A3A3A8",   // detalles apagados
  fondo:    "#F4F4F5",   // fondo gris clarito neutro
  linea:    "#E5E5E8",   // bordes
  blanco:   "#FFFFFF",
  marron:   "#A9805B",   // acento — SOLO detalles (iconos, progreso, badges)
  verde:    "#5B7B54",
  rojo:     "#C24C34",
};

/* ============ DATOS DE INTELIGENCIA ============ */
const TRIP_TYPES = [
  { id: "playa",    label: "Playa",    icon: Sun },
  { id: "montana",  label: "Montaña",  icon: Mountain },
  { id: "ciudad",   label: "Ciudad",   icon: Building2 },
  { id: "negocios", label: "Negocios", icon: Briefcase },
];

const SUGGESTIONS = {
  playa:    ["Bañador", "Toalla de playa", "Crema solar", "Chanclas", "Gafas de sol", "Gorra"],
  montana:  ["Botas de senderismo", "Chubasquero", "Forro polar", "Cantimplora", "Gorro", "Protector labial"],
  ciudad:   ["Zapatillas cómodas", "Mochila pequeña", "Paraguas plegable", "Batería externa"],
  negocios: ["Traje / blazer", "Zapatos formales", "Portátil", "Tarjetas de visita"],
};

const ACTIVITIES = [
  { id: "senderismo", label: "Senderismo", icon: Footprints,
    items: ["Botas de trekking", "Mochila de día", "Cantimplora"] },
  { id: "gimnasio", label: "Gimnasio", icon: Dumbbell,
    items: ["Ropa de deporte", "Zapatillas de entrenar"] },
  { id: "fiesta", label: "Fiesta / cena", icon: PartyPopper,
    items: ["Outfit de noche", "Zapatos de vestir"] },
  { id: "foto", label: "Fotografía", icon: Camera,
    items: ["Cámara", "Baterías y tarjetas SD"] },
  { id: "trabajo", label: "Trabajo", icon: Laptop,
    items: ["Portátil y cargador", "Adaptador de enchufe"] },
  { id: "agua", label: "Agua / piscina", icon: Waves,
    items: ["Bañador", "Gafas de bucear", "Toalla de microfibra"] },
];

const ESSENTIALS_BASE = [
  "DNI / Pasaporte", "Cargador del móvil", "Neceser", "Cepillo y pasta de dientes",
  "Desodorante", "Medicamentos", "Auriculares", "Cartera",
];

const RETURN_CHECKLIST = [
  "Cargadores y cables recogidos",
  "Neceser completo (ducha y lavabo)",
  "Documentos: DNI / pasaporte",
  "Revisar armario y cajones",
  "Revisar enchufes de la habitación",
  "Caja fuerte vacía",
  "Mirar debajo de la cama",
  "Nada tendido ni en el balcón",
];

const calcBasics = (days) => [
  { name: "Ropa interior", qty: days + 1 },
  { name: "Calcetines", qty: days + 1 },
  { name: "Camisetas", qty: Math.ceil(days * 0.8) + 1 },
  { name: "Pantalones", qty: Math.max(2, Math.ceil(days / 3)) },
  { name: "Pijama", qty: days > 4 ? 2 : 1 },
];

/* ============ ESTILOS GLOBALES ============ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

    .tralap * { box-sizing: border-box; }
    .tralap { font-family: 'Inter', sans-serif; }
    .tralap .display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.02em; }

    @keyframes popIn {
      0% { transform: scale(0); }
      70% { transform: scale(1.25); }
      100% { transform: scale(1); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes riseCard {
      from { opacity: 0; transform: translateY(14px) scale(.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .anim-pop   { animation: popIn .28s cubic-bezier(.34,1.56,.64,1); }
    .anim-rise  { animation: riseCard .35s ease both; }
    .anim-fade  { animation: fadeIn .2s ease both; }
    .anim-sheet { animation: slideUp .32s cubic-bezier(.22,1,.36,1) both; }

    .item-row { transition: background .18s ease, transform .15s ease, box-shadow .18s ease; }
    .item-row:active { transform: scale(.985); }

    .swipe-wrap {
      transition: max-height .32s cubic-bezier(.22,1,.36,1), opacity .28s ease, margin .32s ease;
      max-height: 120px; opacity: 1; overflow: visible;
    }
    .swipe-wrap.removing {
      max-height: 0 !important; opacity: 0; margin-bottom: 0 !important; overflow: hidden;
    }

    .tpl-row {
      transition: max-height .3s cubic-bezier(.22,1,.36,1), opacity .25s ease, margin .3s ease;
      max-height: 70px; opacity: 1;
    }
    .tpl-row.removing { max-height: 0; opacity: 0; margin-bottom: 0 !important; overflow: hidden; }

    .tralap input::placeholder { color: #A3A3A8; }

    @media (prefers-reduced-motion: reduce) {
      .tralap * { animation: none !important; transition: none !important; }
    }
  `}</style>
);

/* ============ COMPONENTES BÁSICOS ============ */

function ProgressRing({ pct, accent }) {
  const R = 26, CIRC = 2 * Math.PI * R;
  return (
    <div style={{ position: "relative", width: 64, height: 64 }}>
      <svg width="64" height="64" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="6" />
        <circle
          cx="32" cy="32" r={R} fill="none"
          stroke={pct === 100 ? "#8FBC85" : (accent || C.marron)}
          strokeWidth="6" strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - pct / 100)}
          style={{ transition: "stroke-dashoffset .5s cubic-bezier(.22,1,.36,1), stroke .3s" }}
        />
      </svg>
      <div className="display" style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 14, fontWeight: 700, color: C.blanco
      }}>
        {pct}%
      </div>
    </div>
  );
}

/* Contenido visual de una fila de checklist */
function ItemContent({ item }) {
  return (
    <>
      <span style={{
        width: 24, height: 24, borderRadius: 8, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `2px solid ${item.done ? C.marron : C.grisSuave}`,
        background: item.done ? C.marron : "transparent",
        transition: "background .2s, border-color .2s",
      }}>
        {item.done && <Check size={15} color={C.blanco} strokeWidth={3.5} className="anim-pop" />}
      </span>
      <span style={{
        flex: 1, fontSize: 15, fontWeight: 500,
        color: item.done ? C.grisSuave : C.negro,
        textDecoration: item.done ? "line-through" : "none",
        textDecorationColor: C.grisSuave,
        transition: "color .25s",
      }}>
        {item.name}
      </span>
      {item.qty && (
        <span style={{
          fontSize: 13, fontWeight: 700, color: item.done ? C.grisSuave : C.marron,
          background: item.done ? "transparent" : C.fondo,
          padding: "3px 10px", borderRadius: 99, transition: "all .2s",
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          ×{item.qty}
        </span>
      )}
      {item.fromTemplate && !item.done && <Bookmark size={15} color={C.marron} />}
      {item.fromActivity && !item.done && (() => {
        const Ico = ACTIVITIES.find(a => a.id === item.fromActivity)?.icon || Sparkles;
        return <Ico size={15} color={C.marron} />;
      })()}
      {item.suggested && !item.done && <Sparkles size={15} color={C.marron} />}
    </>
  );
}

/* Fila de checklist deslizable: toque = marcar, deslizar izq. = eliminar */
const ITEM_ACTION_W = 74;

function SwipeableCheckItem({ item, onToggle, onDelete, delay = 0 }) {
  const [dx, setDx] = useState(0);
  const [removing, setRemoving] = useState(false);
  const drag = useRef({ startX: 0, baseDx: 0, moved: false, active: false });

  const onPointerDown = (e) => {
    drag.current = { startX: e.clientX, baseDx: dx, moved: false, active: true };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 6) drag.current.moved = true;
    setDx(Math.min(0, Math.max(-ITEM_ACTION_W - 16, drag.current.baseDx + delta)));
  };
  const onPointerUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (!drag.current.moved) {
      if (dx < -10) setDx(0);
      else onToggle();
      return;
    }
    setDx(dx < -ITEM_ACTION_W / 2 ? -ITEM_ACTION_W : 0);
  };

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(onDelete, 300);
  };

  return (
    <div className={`tpl-row anim-rise ${removing ? "removing" : ""}`}
      style={{ animationDelay: `${delay}ms`, position: "relative", marginBottom: 8 }}>

      {/* Acción eliminar oculta detrás */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", justifyContent: "flex-end",
        borderRadius: 14, overflow: "hidden",
      }}>
        <button onClick={handleDelete} style={{
          width: ITEM_ACTION_W - 8, border: "none", cursor: "pointer", borderRadius: 12,
          background: C.rojo, color: C.blanco, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 3,
          fontSize: 10.5, fontWeight: 700, fontFamily: "'Inter', sans-serif",
          opacity: dx < -25 ? 1 : 0, transform: `scale(${dx < -25 ? 1 : .85})`,
          transition: "opacity .2s, transform .2s",
        }}>
          <Trash2 size={16} /> Eliminar
        </button>
      </div>

      {/* Fila */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="item-row"
        style={{
          transform: `translateX(${dx}px)`,
          transition: drag.current.active ? "none" : "transform .3s cubic-bezier(.22,1,.36,1)",
          display: "flex", alignItems: "center", gap: 14,
          padding: "14px 16px",
          background: item.done ? C.fondo : C.blanco,
          border: `1px solid ${item.done ? "transparent" : C.linea}`,
          borderRadius: 14,
          boxShadow: item.done ? "none" : "0 1px 2px rgba(20,20,20,.04)",
          cursor: "pointer", userSelect: "none", touchAction: "pan-y",
        }}
      >
        <ItemContent item={item} />
      </div>
    </div>
  );
}

/* Fila fija (modo vuelta): solo marcar */
function CheckItem({ item, onToggle, delay = 0 }) {
  return (
    <button
      onClick={onToggle}
      className="item-row anim-rise"
      style={{
        animationDelay: `${delay}ms`,
        display: "flex", alignItems: "center", gap: 14, width: "100%",
        padding: "14px 16px", cursor: "pointer", textAlign: "left",
        background: item.done ? C.fondo : C.blanco,
        border: `1px solid ${item.done ? "transparent" : C.linea}`,
        borderRadius: 14, marginBottom: 8,
        boxShadow: item.done ? "none" : "0 1px 2px rgba(20,20,20,.04)",
      }}
    >
      <ItemContent item={item} />
    </button>
  );
}

function AddItemRow({ onAdd, placeholder = "Añadir elemento…" }) {
  const [value, setValue] = useState("");
  const submit = () => {
    if (value.trim()) { onAdd(value.trim()); setValue(""); }
  };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, marginTop: 4,
      padding: "4px 4px 4px 16px", borderRadius: 14,
      border: `1.5px dashed ${C.linea}`, background: C.blanco,
    }}>
      <Plus size={17} color={C.grisSuave} />
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        placeholder={placeholder}
        style={{
          flex: 1, border: "none", outline: "none", background: "transparent",
          fontSize: 15, fontFamily: "'Inter', sans-serif", color: C.negro, padding: "12px 0",
        }}
      />
      <button onClick={submit} style={{
        border: "none", borderRadius: 10, padding: "9px 16px", cursor: value.trim() ? "pointer" : "default",
        background: value.trim() ? C.negro : C.fondo,
        color: value.trim() ? C.blanco : C.grisSuave,
        fontSize: 13.5, fontWeight: 600, fontFamily: "'Inter', sans-serif",
        transition: "all .2s",
      }}>
        Añadir
      </button>
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={onChange} style={{
      width: 46, height: 27, borderRadius: 99, border: "none", cursor: "pointer",
      background: on ? C.marron : C.linea, position: "relative", flexShrink: 0,
      transition: "background .25s ease",
    }}>
      <span style={{
        position: "absolute", top: 3, left: 3, width: 21, height: 21, borderRadius: "50%",
        background: C.blanco, boxShadow: "0 1px 3px rgba(20,20,20,.25)",
        transform: on ? "translateX(19px)" : "translateX(0)",
        transition: "transform .25s cubic-bezier(.22,1,.36,1)",
      }} />
    </button>
  );
}

/* ============ TARJETA DE VIAJE DESLIZABLE ============ */
const ACTIONS_W = 148;

function SwipeableTripCard({ trip, index, onOpen, onRename, onDelete }) {
  const [dx, setDx] = useState(0);
  const [removing, setRemoving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(trip.name);
  const drag = useRef({ startX: 0, baseDx: 0, moved: false, active: false });

  const all = [...trip.outfits, ...trip.essentials];
  const pct = Math.round((all.filter(x => x.done).length / all.length) * 100);
  const TypeIcon = TRIP_TYPES.find(t => t.id === trip.type)?.icon || Sun;

  const onPointerDown = (e) => {
    if (editing) return;
    drag.current = { startX: e.clientX, baseDx: dx, moved: false, active: true };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const delta = e.clientX - drag.current.startX;
    if (Math.abs(delta) > 6) drag.current.moved = true;
    const next = Math.min(0, Math.max(-ACTIONS_W - 20, drag.current.baseDx + delta));
    setDx(next);
  };
  const onPointerUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (!drag.current.moved) {
      if (dx < -10) setDx(0);
      else onOpen();
      return;
    }
    setDx(dx < -ACTIONS_W / 2.2 ? -ACTIONS_W : 0);
  };

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(onDelete, 320);
  };

  const saveRename = () => {
    const v = draft.trim();
    if (v) onRename(v);
    setEditing(false);
    setDx(0);
  };

  return (
    <div className={`swipe-wrap anim-rise ${removing ? "removing" : ""}`}
      style={{ animationDelay: `${index * 60}ms`, position: "relative", marginBottom: 12 }}>

      <div style={{
        position: "absolute", inset: 0, display: "flex", justifyContent: "flex-end",
        gap: 8, borderRadius: 18, overflow: "hidden",
      }}>
        <button onClick={() => { setEditing(true); setDx(-ACTIONS_W); }} style={{
          width: 66, border: "none", cursor: "pointer", borderRadius: 16,
          background: C.fondo, color: C.negro, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 4,
          fontSize: 11, fontWeight: 700, fontFamily: "'Inter', sans-serif",
          opacity: dx < -30 ? 1 : 0, transform: `scale(${dx < -30 ? 1 : .85})`,
          transition: "opacity .2s, transform .2s",
        }}>
          <Pencil size={17} color={C.marron} /> Renombrar
        </button>
        <button onClick={handleDelete} style={{
          width: 66, border: "none", cursor: "pointer", borderRadius: 16,
          background: C.rojo, color: C.blanco, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 4,
          fontSize: 11, fontWeight: 700, fontFamily: "'Inter', sans-serif",
          opacity: dx < -30 ? 1 : 0, transform: `scale(${dx < -30 ? 1 : .85})`,
          transition: "opacity .2s, transform .2s",
        }}>
          <Trash2 size={17} /> Eliminar
        </button>
      </div>

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          transform: `translateX(${dx}px)`,
          transition: drag.current.active ? "none" : "transform .3s cubic-bezier(.22,1,.36,1)",
          background: C.blanco, borderRadius: 18, padding: 18,
          display: "flex", alignItems: "center", gap: 16,
          border: `1px solid ${C.linea}`,
          boxShadow: "0 2px 8px rgba(20,20,20,.05)",
          cursor: "grab", userSelect: "none", touchAction: "pan-y",
        }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, background: C.fondo, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <TypeIcon size={22} color={C.marron} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") setEditing(false); }}
              onBlur={saveRename}
              onPointerDown={e => e.stopPropagation()}
              style={{
                width: "100%", fontSize: 17, fontWeight: 700, color: C.negro,
                fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em",
                border: "none", borderBottom: `2px solid ${C.marron}`, outline: "none",
                background: "transparent", padding: "0 0 2px",
              }}
            />
          ) : (
            <div className="display" style={{ fontSize: 17, fontWeight: 700, color: C.negro }}>
              {trip.name}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: C.grisSuave, marginTop: 3 }}>
            <Calendar size={12} /> {trip.days} días
          </div>
          <div style={{ height: 5, background: C.fondo, borderRadius: 99, marginTop: 10, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${pct}%`, borderRadius: 99,
              background: pct === 100 ? C.verde : C.marron,
              transition: "width .5s cubic-bezier(.22,1,.36,1)",
            }} />
          </div>
        </div>
        <span className="display" style={{ fontSize: 15, fontWeight: 700, color: pct === 100 ? C.verde : C.marron }}>
          {pct}%
        </span>
      </div>
    </div>
  );
}

/* ============ MI PLANTILLA ============ */
function TemplateRow({ name, onRemove, delay }) {
  const [removing, setRemoving] = useState(false);
  const remove = () => { setRemoving(true); setTimeout(onRemove, 300); };
  return (
    <div className={`tpl-row anim-rise ${removing ? "removing" : ""}`}
      style={{ animationDelay: `${delay}ms`, marginBottom: 8 }}>
      <div className="item-row" style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "13px 8px 13px 16px", background: C.blanco,
        border: `1px solid ${C.linea}`, borderRadius: 14,
        boxShadow: "0 1px 2px rgba(20,20,20,.04)",
      }}>
        <Bookmark size={16} color={C.marron} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: C.negro }}>{name}</span>
        <button onClick={remove} style={{
          width: 34, height: 34, borderRadius: 10, border: "none", cursor: "pointer",
          background: "transparent", color: C.grisSuave,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background .18s, color .18s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = C.fondo; e.currentTarget.style.color = C.rojo; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.grisSuave; }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function TemplateView({ template, onAdd, onRemove }) {
  return (
    <div className="anim-fade">
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px",
        background: C.blanco, border: `1px solid ${C.linea}`, borderRadius: 16, marginBottom: 16,
      }}>
        <Bookmark size={18} color={C.marron} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: 13, color: C.gris, lineHeight: 1.5 }}>
          Guarda aquí lo que <strong style={{ color: C.negro }}>siempre llevas</strong> a cualquier viaje.
          Al crear un viaje nuevo podrás incluirlo todo de un toque, sin volver a escribirlo.
        </p>
      </div>

      {template.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: 13.5, color: C.grisSuave, padding: "24px 0" }}>
          Tu plantilla está vacía. Añade tu primer imprescindible.
        </p>
      ) : (
        template.map((name, i) => (
          <TemplateRow key={name} name={name} delay={i * 35} onRemove={() => onRemove(name)} />
        ))
      )}

      <AddItemRow onAdd={onAdd} placeholder="Ej. Tapones para dormir…" />
    </div>
  );
}

/* ============ PANTALLA: DETALLE DE VIAJE ============ */
function TripView({ trip, onBack, onToggle, onAddItem, onDeleteItem, onToggleReturn }) {
  const [tab, setTab] = useState("outfits");
  const [mode, setMode] = useState("ida");

  const all = [...trip.outfits, ...trip.essentials];
  const pctIda = all.length ? Math.round((all.filter(i => i.done).length / all.length) * 100) : 0;
  const pctVuelta = Math.round((trip.returnList.filter(i => i.done).length / trip.returnList.length) * 100);
  const pct = mode === "ida" ? pctIda : pctVuelta;

  const items = tab === "outfits" ? trip.outfits : trip.essentials;
  const TypeIcon = TRIP_TYPES.find(t => t.id === trip.type)?.icon || Sun;

  return (
    <div className="anim-fade">
      <div style={{ background: C.negro, borderRadius: "0 0 28px 28px", padding: "20px 22px 22px" }}>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,.09)", border: "none", borderRadius: 12,
          width: 38, height: 38, display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", marginBottom: 18,
        }}>
          <ChevronLeft size={20} color={C.blanco} />
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <TypeIcon size={15} color={C.marron} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.marron, letterSpacing: .3 }}>
                {TRIP_TYPES.find(t => t.id === trip.type)?.label} · {trip.days} días
              </span>
            </div>
            <h1 className="display" style={{ margin: 0, fontSize: 28, fontWeight: 700, color: C.blanco }}>
              {trip.name}
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "rgba(255,255,255,.55)" }}>
              {mode === "ida"
                ? (pct === 100 ? "¡Maleta lista!" : `${all.filter(i => !i.done).length} cosas por guardar`)
                : (pct === 100 ? "Todo revisado. ¡Buen regreso!" : `${trip.returnList.filter(i => !i.done).length} comprobaciones pendientes`)}
            </p>
          </div>
          <ProgressRing pct={pct} accent={mode === "vuelta" ? "#8FBC85" : undefined} />
        </div>

        <div style={{
          display: "flex", marginTop: 18, background: "rgba(255,255,255,.08)",
          borderRadius: 12, padding: 4, position: "relative",
        }}>
          <span style={{
            position: "absolute", top: 4, bottom: 4, width: "calc(50% - 4px)",
            left: mode === "ida" ? 4 : "calc(50%)",
            background: C.marron, borderRadius: 9,
            transition: "left .28s cubic-bezier(.22,1,.36,1)",
          }} />
          {[
            { id: "ida", label: "Preparar maleta", icon: Luggage },
            { id: "vuelta", label: "Modo vuelta", icon: Undo2 },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              flex: 1, position: "relative", zIndex: 1, border: "none", cursor: "pointer",
              background: "transparent", padding: "9px 0",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
              color: mode === m.id ? C.blanco : "rgba(255,255,255,.55)",
              transition: "color .25s",
            }}>
              <m.icon size={14} /> {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === "ida" ? (
        <div key="ida" className="anim-fade">
          <div style={{ display: "flex", gap: 8, padding: "18px 22px 10px" }}>
            {[
              { id: "outfits", label: "Outfits", icon: Shirt },
              { id: "essentials", label: "Esenciales", icon: FileText },
            ].map(t => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8, padding: "12px 0", borderRadius: 12, cursor: "pointer",
                  fontSize: 14.5, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
                  border: `1px solid ${active ? C.negro : C.linea}`,
                  background: active ? C.negro : C.blanco,
                  color: active ? C.blanco : C.gris,
                  boxShadow: active ? "0 4px 12px rgba(20,20,20,.22)" : "none",
                  transform: active ? "translateY(-1px)" : "none",
                  transition: "all .25s cubic-bezier(.22,1,.36,1)",
                }}>
                  <t.icon size={16} /> {t.label}
                </button>
              );
            })}
          </div>

          <div style={{ padding: "6px 22px 30px" }} key={tab}>
            <p style={{ fontSize: 12.5, color: C.marron, fontWeight: 600, margin: "6px 4px 12px", display: "flex", gap: 6, alignItems: "center" }}>
              <Sparkles size={13} />
              {tab === "outfits"
                ? `Cantidades calculadas para ${trip.days} días`
                : `Incluye sugerencias para ${TRIP_TYPES.find(t => t.id === trip.type)?.label.toLowerCase()}`}
            </p>
            {items.map((item, i) => (
              <SwipeableCheckItem key={item.name + i} item={item} delay={i * 35}
                onToggle={() => onToggle(tab, item.name)}
                onDelete={() => onDeleteItem(tab, item.name)} />
            ))}
            <AddItemRow onAdd={name => onAddItem(tab, name)} />
            <p style={{ fontSize: 11.5, color: C.grisSuave, textAlign: "center", margin: "12px 0 0" }}>
              Toca para marcar · desliza a la izquierda para eliminar
            </p>
          </div>
        </div>
      ) : (
        <div key="vuelta" className="anim-fade" style={{ padding: "18px 22px 30px" }}>
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px",
            background: C.blanco, border: `1px solid ${C.linea}`, borderRadius: 16, marginBottom: 14,
          }}>
            <Search size={18} color={C.verde} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 13, color: C.gris, lineHeight: 1.5 }}>
              Repasa esto <strong style={{ color: C.negro }}>antes de salir del alojamiento</strong> para
              no dejarte nada atrás.
            </p>
          </div>
          {trip.returnList.map((item, i) => (
            <CheckItem key={item.name} item={item} delay={i * 35}
              onToggle={() => onToggleReturn(item.name)} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ PANTALLA: MODAL NUEVO VIAJE ============ */
function NewTripSheet({ onClose, onCreate, templateCount }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("playa");
  const [days, setDays] = useState(5);
  const [useTemplate, setUseTemplate] = useState(templateCount > 0);
  const [acts, setActs] = useState([]);

  const toggleAct = (id) =>
    setActs(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);

  return (
    <div className="anim-fade" style={{
      position: "absolute", inset: 0, background: "rgba(20,20,20,.42)",
      display: "flex", alignItems: "flex-end", zIndex: 10, borderRadius: 40,
    }}>
      <div className="anim-sheet" style={{
        background: C.blanco, borderRadius: "24px 24px 40px 40px", width: "100%",
        padding: "24px 24px 28px", maxHeight: "92%", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 className="display" style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.negro }}>
            Nuevo viaje
          </h2>
          <button onClick={onClose} style={{
            background: C.fondo, border: "none", borderRadius: 10, width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <X size={16} color={C.gris} />
          </button>
        </div>

        <label style={{ fontSize: 12, fontWeight: 700, color: C.gris, letterSpacing: 1 }}>DESTINO</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Ej. Menorca"
          style={{
            width: "100%", marginTop: 8, marginBottom: 16, padding: "13px 16px",
            borderRadius: 12, border: `1.5px solid ${C.linea}`, background: C.fondo,
            fontSize: 15, fontFamily: "'Inter', sans-serif", color: C.negro, outline: "none",
          }}
        />

        <label style={{ fontSize: 12, fontWeight: 700, color: C.gris, letterSpacing: 1 }}>TIPO DE VIAJE</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "8px 0 16px" }}>
          {TRIP_TYPES.map(t => {
            const active = type === t.id;
            return (
              <button key={t.id} onClick={() => setType(t.id)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "12px 14px",
                borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                border: `1.5px solid ${active ? C.negro : C.linea}`,
                background: active ? C.negro : C.blanco,
                color: active ? C.blanco : C.gris,
                transition: "all .2s",
              }}>
                <t.icon size={16} color={active ? C.marron : C.grisSuave} /> {t.label}
              </button>
            );
          })}
        </div>

        <label style={{ fontSize: 12, fontWeight: 700, color: C.gris, letterSpacing: 1 }}>
          ACTIVIDADES <span style={{ color: C.grisSuave, fontWeight: 500, letterSpacing: 0 }}>(opcional — añaden sus propios ítems)</span>
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "8px 0 16px" }}>
          {ACTIVITIES.map(a => {
            const active = acts.includes(a.id);
            return (
              <button key={a.id} onClick={() => toggleAct(a.id)} style={{
                display: "flex", alignItems: "center", gap: 7, padding: "9px 14px",
                borderRadius: 99, cursor: "pointer", fontSize: 13, fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                border: `1.5px solid ${active ? C.marron : C.linea}`,
                background: active ? C.negro : C.blanco,
                color: active ? C.blanco : C.gris,
                transform: active ? "scale(1.03)" : "scale(1)",
                transition: "all .2s cubic-bezier(.34,1.3,.64,1)",
              }}>
                <a.icon size={14} color={active ? C.marron : undefined} />
                {a.label}
                {active && <Check size={13} strokeWidth={3} className="anim-pop" />}
              </button>
            );
          })}
        </div>

        <label style={{ fontSize: 12, fontWeight: 700, color: C.gris, letterSpacing: 1 }}>
          DURACIÓN — <span className="display" style={{ color: C.marron, fontSize: 13 }}>{days} días</span>
        </label>
        <input
          type="range" min="1" max="21" value={days}
          onChange={e => setDays(+e.target.value)}
          style={{ width: "100%", margin: "12px 0 16px", accentColor: C.marron }}
        />

        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
          borderRadius: 14, marginBottom: 18,
          background: C.fondo,
          border: `1.5px solid ${useTemplate && templateCount > 0 ? C.marron : C.linea}`,
          opacity: templateCount === 0 ? .55 : 1,
          transition: "border-color .25s",
        }}>
          <Bookmark size={17} color={useTemplate && templateCount > 0 ? C.marron : C.grisSuave} style={{ transition: "color .25s" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.negro }}>Incluir mi plantilla</div>
            <div style={{ fontSize: 12, color: C.gris, marginTop: 1 }}>
              {templateCount === 0
                ? "Aún no has guardado imprescindibles"
                : `${templateCount} imprescindible${templateCount === 1 ? "" : "s"} → Esenciales`}
            </div>
          </div>
          <Toggle on={useTemplate && templateCount > 0}
            onChange={() => templateCount > 0 && setUseTemplate(v => !v)} />
        </div>

        <button
          onClick={() => name.trim() && onCreate({
            name: name.trim(), type, days, acts,
            useTemplate: useTemplate && templateCount > 0,
          })}
          style={{
            width: "100%", padding: "16px 0", borderRadius: 14, border: "none",
            background: name.trim() ? C.negro : C.linea, color: name.trim() ? C.blanco : C.grisSuave,
            fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
            cursor: name.trim() ? "pointer" : "default",
            boxShadow: name.trim() ? "0 6px 16px rgba(20,20,20,.25)" : "none",
            transition: "all .25s",
          }}
        >
          Crear lista de equipaje
        </button>
      </div>
    </div>
  );
}

/* ============ PANTALLA: INICIO ============ */
function Home({ trips, template, onOpen, onNew, onRename, onDelete, onTplAdd, onTplRemove }) {
  const [homeTab, setHomeTab] = useState("viajes");

  return (
    <div className="anim-fade" style={{ padding: "28px 24px 30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 13, background: C.negro,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
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
        {[
          { id: "viajes", label: "Mis viajes", icon: Luggage },
          { id: "plantilla", label: "Mi plantilla", icon: Bookmark },
        ].map(t => {
          const active = homeTab === t.id;
          return (
            <button key={t.id} onClick={() => setHomeTab(t.id)} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, padding: "12px 0", borderRadius: 12, cursor: "pointer",
              fontSize: 14.5, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
              border: `1px solid ${active ? C.negro : C.linea}`,
              background: active ? C.negro : C.blanco,
              color: active ? C.blanco : C.gris,
              boxShadow: active ? "0 4px 12px rgba(20,20,20,.22)" : "none",
              transform: active ? "translateY(-1px)" : "none",
              transition: "all .25s cubic-bezier(.22,1,.36,1)",
            }}>
              <t.icon size={16} color={active ? C.marron : undefined} /> {t.label}
            </button>
          );
        })}
      </div>

      {homeTab === "plantilla" ? (
        <TemplateView key="tpl" template={template} onAdd={onTplAdd} onRemove={onTplRemove} />
      ) : (
        <div key="viajes" className="anim-fade">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span className="display" style={{ fontSize: 12.5, fontWeight: 700, color: C.negro, letterSpacing: 1.5 }}>MIS VIAJES</span>
            <span style={{ fontSize: 12.5, color: C.grisSuave, fontWeight: 500 }}>{trips.length} activos</span>
          </div>

          {trips.map((trip, i) => (
            <SwipeableTripCard
              key={trip.id}
              trip={trip}
              index={i}
              onOpen={() => onOpen(i)}
              onRename={name => onRename(i, name)}
              onDelete={() => onDelete(i)}
            />
          ))}

          <p style={{ fontSize: 11.5, color: C.grisSuave, textAlign: "center", margin: "2px 0 10px" }}>
            Desliza una tarjeta hacia la izquierda para renombrar o eliminar
          </p>

          <button onClick={onNew} style={{
            width: "100%", padding: "16px 0", borderRadius: 16,
            border: `2px dashed ${C.grisSuave}`, background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontSize: 15, fontWeight: 700, color: C.gris, fontFamily: "'Space Grotesk', sans-serif",
            transition: "all .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.blanco; e.currentTarget.style.borderStyle = "solid"; e.currentTarget.style.borderColor = C.marron; e.currentTarget.style.color = C.marron; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderStyle = "dashed"; e.currentTarget.style.borderColor = C.grisSuave; e.currentTarget.style.color = C.gris; }}
          >
            <Plus size={18} /> Nuevo viaje
          </button>
        </div>
      )}
    </div>
  );
}

/* ============ APP ============ */
const buildItems = (type, days, templateItems = [], actIds = []) => {
  const actItems = actIds.flatMap(id => {
    const act = ACTIVITIES.find(a => a.id === id);
    return act ? act.items.map(name => ({ name, done: false, fromActivity: id })) : [];
  });
  const suggested = SUGGESTIONS[type].filter(
    s => !actItems.some(a => a.name.toLowerCase() === s.toLowerCase())
  );
  return {
    outfits: calcBasics(days).map(b => ({ ...b, done: false })),
    essentials: [
      ...ESSENTIALS_BASE.map(name => ({ name, done: false })),
      ...suggested.map(name => ({ name, done: false, suggested: true })),
      ...actItems,
      ...templateItems.map(name => ({ name, done: false, fromTemplate: true })),
    ],
    returnList: RETURN_CHECKLIST.map(name => ({ name, done: false })),
  };
};

let nextId = 3;

export default function Tralap() {
  const [template, setTemplate] = useState([
    "Tapones para dormir", "Gafas de repuesto", "Libro / e-reader",
  ]);
  const [trips, setTrips] = useState(() => {
    const demo = buildItems("playa", 7, [], ["senderismo"]);
    demo.outfits = demo.outfits.map((x, i) => ({ ...x, done: i < 3 }));
    demo.essentials = demo.essentials.map((x, i) => ({ ...x, done: i < 2 }));
    const demo2 = buildItems("negocios", 3);
    return [
      { id: 1, name: "Menorca", type: "playa", days: 7, ...demo },
      { id: 2, name: "Madrid — Feria", type: "negocios", days: 3, ...demo2 },
    ];
  });
  const [openIdx, setOpenIdx] = useState(null);
  const [showNew, setShowNew] = useState(false);

  const listKey = tab => tab === "outfits" ? "outfits" : "essentials";

  const toggle = (tab, itemName) => {
    setTrips(ts => ts.map((t, i) => i !== openIdx ? t : {
      ...t,
      [listKey(tab)]: t[listKey(tab)].map(it =>
        it.name === itemName ? { ...it, done: !it.done } : it),
    }));
  };

  const toggleReturn = (itemName) => {
    setTrips(ts => ts.map((t, i) => i !== openIdx ? t : {
      ...t,
      returnList: t.returnList.map(it =>
        it.name === itemName ? { ...it, done: !it.done } : it),
    }));
  };

  const addItem = (tab, name) => {
    setTrips(ts => ts.map((t, i) => i !== openIdx ? t : {
      ...t,
      [listKey(tab)]: [...t[listKey(tab)], { name, done: false, custom: true }],
    }));
  };

  const deleteItem = (tab, itemName) => {
    setTrips(ts => ts.map((t, i) => i !== openIdx ? t : {
      ...t,
      [listKey(tab)]: t[listKey(tab)].filter(it => it.name !== itemName),
    }));
  };

  const renameTrip = (idx, name) => {
    setTrips(ts => ts.map((t, i) => i === idx ? { ...t, name } : t));
  };

  const deleteTrip = (idx) => {
    setTrips(ts => ts.filter((_, i) => i !== idx));
  };

  const createTrip = ({ name, type, days, acts, useTemplate }) => {
    setTrips(ts => [...ts, {
      id: nextId++, name, type, days,
      ...buildItems(type, days, useTemplate ? template : [], acts),
    }]);
    setShowNew(false);
    setOpenIdx(trips.length);
  };

  const tplAdd = (name) => {
    setTemplate(t => t.includes(name) ? t : [...t, name]);
  };
  const tplRemove = (name) => {
    setTemplate(t => t.filter(x => x !== name));
  };

  return (
    <div className="tralap" style={{
      minHeight: "100vh", background: "#111113",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <GlobalStyles />
      <div style={{
        width: 390, height: 780, background: C.fondo, borderRadius: 40,
        overflow: "hidden", position: "relative",
        boxShadow: "0 30px 80px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.06)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {openIdx === null
            ? <Home trips={trips} template={template}
                onOpen={setOpenIdx} onNew={() => setShowNew(true)}
                onRename={renameTrip} onDelete={deleteTrip}
                onTplAdd={tplAdd} onTplRemove={tplRemove} />
            : <TripView trip={trips[openIdx]} onBack={() => setOpenIdx(null)}
                onToggle={toggle} onAddItem={addItem} onDeleteItem={deleteItem}
                onToggleReturn={toggleReturn} />}
        </div>
        {showNew && <NewTripSheet onClose={() => setShowNew(false)} onCreate={createTrip}
          templateCount={template.length} />}
      </div>
    </div>
  );
}
