/**
 * Pide al navegador que no borre los datos de Tralap cuando le falte espacio.
 * Chrome lo concede solo (sobre todo con la app instalada), Firefox pregunta al
 * usuario y Safari decide por su cuenta. Se llama tras un gesto del usuario
 * (crear un viaje, restaurar una copia) para que la pregunta tenga contexto.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

/** true/false si el navegador lo sabe; null si no lo soporta. */
export async function isStoragePersisted(): Promise<boolean | null> {
  try {
    if (!navigator.storage?.persisted) return null;
    return await navigator.storage.persisted();
  } catch {
    return null;
  }
}
