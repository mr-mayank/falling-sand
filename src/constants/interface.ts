export interface ShipInterface {
  id: number;
  placed: boolean;
  position: { row: number; col: number } | null;
  orientation: string;
  size: number;
}
