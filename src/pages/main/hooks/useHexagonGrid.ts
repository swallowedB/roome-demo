import { useMemo } from 'react';
import { buildHiveGrid } from '../engine/HiveGrid';

export default function useHexagonGrid(
  rooms: Room[],
  centerX = 0,
  centerY = 0,
) {
  return useMemo(
    () => buildHiveGrid(rooms, centerX, centerY),
    [rooms, centerX, centerY],
  );
}
