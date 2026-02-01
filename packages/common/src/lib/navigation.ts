/**
 * Determines if a navigation item is active based on the current pathname
 * @param href - The href of the navigation item
 * @param pathname - The current pathname
 * @param exact - Whether to match exactly or use startsWith (default: false)
 * @returns boolean indicating if the item is active
 */
export function isNavItemActive(href: string, pathname: string, exact = false): boolean {
  if (exact) {
    return pathname === href
  }
  
  // For root dashboard, use exact match to avoid matching all dashboard routes
  if (href === '/dashboard') {
    return pathname === '/dashboard'
  }
  
  return pathname.startsWith(href)
}

/**
 * Gets the active navigation item ID from a list of navigation items
 * @param items - Array of navigation items with id and href
 * @param pathname - The current pathname
 * @returns The id of the active item or null
 */
export function getActiveNavItemId<T extends { id: string; href: string }>(
  items: readonly T[],
  pathname: string
): string | null {
  const activeItem = items.find(item => isNavItemActive(item.href, pathname))
  return activeItem?.id ?? null
}
