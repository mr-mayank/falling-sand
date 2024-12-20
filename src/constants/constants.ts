export const shipsData = [
  { id: 1, size: 2 },
  { id: 2, size: 3 },
  { id: 3, size: 3 },
  { id: 4, size: 4 },
  { id: 5, size: 5 },
];

export const GRID_WIDTH = 9;
export const GRID_HEIGHT = 7;
export const TOTAL_SHIP_SIZE = 17;

export class DataIntegrityError extends Error {
  constructor() {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DataIntegrityError);
    }

    this.name = "DataIntegrityError";
    this.message =
      "Data integrity check failed. The saved game may have been tampered with.";
  }
}
