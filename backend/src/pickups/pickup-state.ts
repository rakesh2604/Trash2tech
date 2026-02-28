import { PickupStatus } from '../entities/pickup.entity';
import { DomainError } from '../common/domain-error';

const allowed: Record<PickupStatus, PickupStatus[]> = {
  [PickupStatus.NEW]: [PickupStatus.SCHEDULED, PickupStatus.CANCELLED],
  [PickupStatus.SCHEDULED]: [PickupStatus.ASSIGNED, PickupStatus.CANCELLED],
  [PickupStatus.ASSIGNED]: [PickupStatus.IN_COLLECTION, PickupStatus.CANCELLED],
  [PickupStatus.IN_COLLECTION]: [PickupStatus.AT_HUB, PickupStatus.CANCELLED],
  [PickupStatus.AT_HUB]: [PickupStatus.WEIGHED],
  [PickupStatus.WEIGHED]: [PickupStatus.IN_LOT],
  [PickupStatus.IN_LOT]: [PickupStatus.LOT_DISPATCHED],
  [PickupStatus.LOT_DISPATCHED]: [PickupStatus.RECYCLED],
  [PickupStatus.RECYCLED]: [],
  [PickupStatus.CANCELLED]: [],
};

export function assertPickupTransition(from: PickupStatus, to: PickupStatus): void {
  const ok = allowed[from]?.includes(to) ?? false;
  if (!ok) {
    throw new DomainError('INVALID_PICKUP_TRANSITION', 'Invalid pickup transition', {
      from,
      to,
    });
  }
}
