import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Allowed roles for the route. User's role must match one of these.
 * Use API role names: ADMIN, FIELD_CAPTAIN, RECYCLER, BRAND.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
