/**
 * Role display names and signup options.
 * API returns: ADMIN, FIELD_CAPTAIN, RECYCLER, BRAND, COORDINATOR, CITIZEN
 * (backend maps RECYCLER_USER→RECYCLER, BRAND_USER→BRAND in JWT).
 * Use these labels everywhere we show "role" to users so they connect easily.
 */

/** Display name for each API role (and DB role where different). */
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  ADMIN: 'Administrator',
  FIELD_CAPTAIN: 'Hub & collection officer',
  COORDINATOR: 'Operations coordinator',
  RECYCLER: 'Recycler facility',
  RECYCLER_USER: 'Recycler facility',
  BRAND: 'Brand / EPR producer',
  BRAND_USER: 'Brand / EPR producer',
  CITIZEN: 'Citizen / General public',
};

export function getRoleDisplayName(role: string): string {
  if (!role) return '—';
  return ROLE_DISPLAY_NAMES[role] ?? role;
}

/**
 * Signup role options. Value must match backend UserRole enum.
 * CITIZEN is the default for website signup (general public).
 */
export const SIGNUP_ROLES = [
  { value: 'CITIZEN', label: 'Citizen / General public (website signup)' },
  { value: 'FIELD_CAPTAIN', label: 'Hub & collection officer (field)' },
  { value: 'RECYCLER_USER', label: 'Recycler facility' },
  { value: 'BRAND_USER', label: 'Brand / EPR producer' },
  { value: 'COORDINATOR', label: 'Operations coordinator' },
  { value: 'ADMIN', label: 'Administrator' },
] as const;
