import { Ref } from 'vue'

export function handleMenuClick(
  event: MouseEvent,
  menuEl: HTMLDivElement | null,
  showMenu: Ref<boolean, boolean>,
) {
  if (!menuEl) return
  if (!menuEl.contains(event.target as HTMLElement)) showMenu.value = false
}
