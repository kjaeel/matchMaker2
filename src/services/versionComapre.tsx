export function isVersionLower(current: string, minimum: string): boolean {
    const c = current.split('.').map(Number);
    const m = minimum.split('.').map(Number);
  
    for (let i = 0; i < m.length; i++) {
      if ((c[i] || 0) < (m[i] || 0)) return true;
      if ((c[i] || 0) > (m[i] || 0)) return false;
    }
    return false;
  }