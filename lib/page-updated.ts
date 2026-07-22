// Editors call this after a successful save so the live PagePreview iframe
// (components/dashboard/PagePreview.tsx) reloads to show the change.
export function notifyPageUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('workwith:page-updated'))
  }
}
