import { useEffect, useRef, useState } from "react";
import { Download, Moon, ShieldAlert, ShieldCheck, Smartphone, TriangleAlert, Upload } from "lucide-react";
import {
  exportBackup,
  exportRescues,
  parseBackup,
  type BackupData,
  type MergeResult,
} from "../data/backup";
import { isStoragePersisted } from "../data/persist";
import { listRescues } from "../data/storage";
import { C } from "../theme/colors";
import { primaryButton } from "../theme/tokens";
import { countLabel, sinceLabel } from "../utils/text";
import { Hint, InfoNote, Strong } from "./ui/Notes";
import { Toggle } from "./Toggle";
import { Sheet } from "./ui/Sheet";

interface DataSheetProps {
  trips: BackupData["trips"];
  template: BackupData["template"];
  lastBackup: Date | null;
  onBackupSaved: (date: Date) => void;
  onImport: (data: BackupData) => MergeResult;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onClose: () => void;
}

type Message = { text: string; error?: boolean } | null;

const restoreSummary = (r: MergeResult): string => {
  const parts: string[] = [];
  if (r.addedTrips > 0) parts.push(countLabel(r.addedTrips, "viaje", "viajes"));
  if (r.addedTemplate > 0) {
    parts.push(countLabel(r.addedTemplate, "imprescindible", "imprescindibles"));
  }
  if (parts.length === 0) return "Ya tenías todo lo que hay en esta copia: no se ha añadido nada.";
  return `Restaurado: ${parts.join(" y ")}.`;
};

export function DataSheet({
  trips,
  template,
  lastBackup,
  onBackupSaved,
  onImport,
  darkMode,
  onToggleDarkMode,
  onClose,
}: DataSheetProps) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [rescues] = useState(() => listRescues(window.localStorage));
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    void isStoragePersisted().then((p) => {
      if (alive) setPersisted(p);
    });
    return () => {
      alive = false;
    };
  }, []);

  const save = async (): Promise<void> => {
    setBusy(true);
    setMessage(null);
    try {
      const outcome = await exportBackup({ trips, template });
      if (outcome !== "cancelled") {
        onBackupSaved(new Date());
        setMessage({
          text:
            outcome === "shared"
              ? "Copia creada. Guárdala fuera del móvil (Archivos, Drive, correo…)."
              : "Copia descargada. Guárdala en un sitio seguro.",
        });
      }
    } catch {
      setMessage({ text: "No se ha podido crear la copia.", error: true });
    } finally {
      setBusy(false);
    }
  };

  const restore = async (file: File): Promise<void> => {
    setMessage(null);
    let text: string;
    try {
      text = await file.text();
    } catch {
      setMessage({ text: "No se ha podido leer el archivo.", error: true });
      return;
    }
    const parsed = parseBackup(text);
    if (!parsed.ok) {
      setMessage({ text: parsed.error, error: true });
      return;
    }
    setMessage({ text: restoreSummary(onImport(parsed)) });
  };

  const downloadRescues = (): void => {
    const entries = Object.fromEntries(
      rescues.map((k) => [k, window.localStorage.getItem(k)]),
    );
    void exportRescues(entries);
  };

  return (
    <Sheet title="Ajustes" onClose={onClose}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "13px 16px",
          borderRadius: 14,
          marginBottom: 14,
          border: `1px solid ${C.line}`,
        }}
      >
        <Moon size={17} color={C.gray} style={{ flexShrink: 0 }} />
        <span id="ajuste-modo-oscuro" style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.ink }}>
          Modo oscuro
        </span>
        <Toggle on={darkMode} onChange={onToggleDarkMode} labelledBy="ajuste-modo-oscuro" />
      </div>

      <InfoNote icon={Smartphone} style={{ marginBottom: 14 }}>
        Tus viajes se guardan <Strong>solo en este dispositivo</Strong>. Si borras los datos del
        navegador o cambias de móvil, se pierden. Guarda una copia de vez en cuando.
      </InfoNote>

      <div
        style={{
          padding: "13px 16px",
          borderRadius: 14,
          marginBottom: 16,
          border: `1px solid ${C.line}`,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>
          {countLabel(trips.length, "viaje", "viajes")} ·{" "}
          {countLabel(template.length, "imprescindible", "imprescindibles")}
        </div>
        <div style={{ fontSize: 12.5, color: C.gray, marginTop: 2 }}>
          {lastBackup
            ? `Última copia: ${sinceLabel(lastBackup)}`
            : "Aún no has guardado ninguna copia"}
        </div>
      </div>

      <button
        onClick={() => void save()}
        disabled={busy}
        className="press"
        style={{ ...primaryButton(), opacity: busy ? 0.7 : 1 }}
      >
        <Download size={18} /> Guardar copia
      </button>

      <button
        onClick={() => fileInput.current?.click()}
        className="press"
        style={{
          ...primaryButton(),
          marginTop: 10,
          border: `1px solid ${C.line}`,
          background: C.white,
          color: C.ink,
        }}
      >
        <Upload size={18} /> Restaurar una copia
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void restore(file);
        }}
      />
      <Hint style={{ margin: "10px 0 0" }}>
        Lo que restaures se añade a lo que ya tienes: no se borra nada.
      </Hint>

      {message && (
        <p
          role={message.error ? "alert" : "status"}
          style={{
            margin: "14px 0 0",
            fontSize: 13.5,
            fontWeight: 600,
            lineHeight: 1.45,
            color: message.error ? C.rojo : C.ink,
            textAlign: "center",
          }}
        >
          {message.text}
        </p>
      )}

      {persisted !== null && (
        <p
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            margin: "18px 0 0",
            fontSize: 12.5,
            lineHeight: 1.45,
            color: C.gray,
          }}
        >
          {persisted ? (
            <>
              <ShieldCheck size={16} color={C.gray} style={{ flexShrink: 0, marginTop: 1 }} />
              El navegador no borrará estos datos aunque le falte espacio.
            </>
          ) : (
            <>
              <ShieldAlert size={16} color={C.gray} style={{ flexShrink: 0, marginTop: 1 }} />
              Si el navegador se queda sin espacio podría borrarlos. Instalar Tralap en la pantalla
              de inicio ayuda a protegerlos.
            </>
          )}
        </p>
      )}

      {rescues.length > 0 && (
        <InfoNote icon={TriangleAlert} style={{ marginTop: 16 }}>
          Había datos que esta versión no pudo leer y se han guardado aparte, sin borrarlos.{" "}
          <button
            onClick={downloadRescues}
            style={{
              font: "inherit",
              border: "none",
              background: "transparent",
              padding: 0,
              color: C.ink,
              fontWeight: 600,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Descargarlos
          </button>
        </InfoNote>
      )}
    </Sheet>
  );
}
