const PREFIX = "[Conway]";
const isDev = import.meta.env.DEV;

export function logGridUpdate(
  label: string,
  data?: Record<string, unknown>
): void {
  if (!isDev) return;
  if (data) {
    console.log(`${PREFIX} ${label}`, data);
  } else {
    console.log(`${PREFIX} ${label}`);
  }
}
