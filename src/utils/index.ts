// Add these encryption utility functions
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  DataIntegrityError,
} from "../constants/constants";
import { ShipInterface } from "../constants/interface";

export const generateKey = async (): Promise<CryptoKey> => {
  // Generate a cryptographic key for AES-GCM encryption
  return await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
};

export const encryptData = async (
  data: any,
  key: CryptoKey
): Promise<string> => {
  // Convert data to JSON string
  const encodedData = new TextEncoder().encode(JSON.stringify(data));

  // Generate a random initialization vector (IV)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the data
  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData
  );

  // Combine IV and encrypted data using a more compatible method
  const combinedData = new Uint8Array(iv.length + encryptedContent.byteLength);
  combinedData.set(iv, 0);
  combinedData.set(new Uint8Array(encryptedContent), iv.length);

  // Convert to base64 for storage
  return btoa(String.fromCharCode.apply(null, Array.from(combinedData)));
};

export const decryptData = async (
  encryptedBase64: string,
  key: CryptoKey
): Promise<any> => {
  try {
    // Convert base64 to Uint8Array
    const encryptedDataWithIV = new Uint8Array(
      atob(encryptedBase64)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    // Extract IV (first 12 bytes)
    const iv = encryptedDataWithIV.slice(0, 12);
    const encryptedContent = encryptedDataWithIV.slice(12);

    // Decrypt the data
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedContent
    );

    // Convert decrypted data back to string and parse JSON
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedContent));
  } catch (error) {
    // This catch block will trigger if:
    // 1. The key is incorrect
    // 2. The data has been tampered with
    throw new DataIntegrityError();
  }
};

export const validatePlacement = (
  rowIndex: number,
  colIndex: number,
  size: number,
  orientation: string,
  newGrid: {
    isOccupied: boolean;
    shipId: number;
  }[][]
): boolean => {
  if (orientation === "horizontal") {
    if (colIndex + size > GRID_WIDTH) return false;

    for (let i = 0; i < size; i++) {
      const tile = newGrid[rowIndex]?.[colIndex + i];
      if (!tile || tile.isOccupied) return false;
    }
  } else {
    if (rowIndex + size > GRID_HEIGHT) return false;

    for (let i = 0; i < size; i++) {
      const tile = newGrid[rowIndex + i]?.[colIndex];
      if (!tile || tile.isOccupied) return false;
    }
  }

  return true;
};

export const handleRandomPlacement = (
  initialGrid: {
    isOccupied: boolean;
    shipId: number;
    isRevealed?: boolean;
  }[][],
  initialShips: ShipInterface[],
  type: string
): {
  newGrid: {
    isOccupied: boolean;
    shipId: number;
    isRevealed?: boolean;
  }[][];
  placedShips: ShipInterface[];
} => {
  let newGrid: {
    isOccupied: boolean;
    shipId: number;
    isRevealed?: boolean;
  }[][];
  if (type === "bot") {
    newGrid = initialGrid.map((row) =>
      row.map(() => ({
        isOccupied: false,
        shipId: -1,
        isRevealed: false,
      }))
    );
  } else {
    newGrid = initialGrid.map((row) =>
      row.map(() => ({
        isOccupied: false,
        shipId: -1,
      }))
    );
  }

  const newShips = initialShips.map((ship) => ({
    ...ship,
    placed: false,
    position: null,
    orientation: "horizontal",
  }));

  const tryPlaceShip = (ship: ShipInterface): ShipInterface => {
    for (let attempts = 0; attempts < 100; attempts++) {
      const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
      const maxRow =
        orientation === "horizontal" ? GRID_HEIGHT : GRID_HEIGHT - ship.size;
      const maxCol =
        orientation === "horizontal" ? GRID_WIDTH - ship.size : GRID_WIDTH;

      const row = Math.floor(Math.random() * maxRow);
      const col = Math.floor(Math.random() * maxCol);

      if (validatePlacement(row, col, ship.size, orientation, newGrid)) {
        // Place the ship on the grid
        if (orientation === "horizontal") {
          for (let i = 0; i < ship.size; i++) {
            if (type === "bot") {
              newGrid[row][col + i] = {
                isOccupied: true,
                shipId: ship.id,
                isRevealed: false,
              };
            } else {
              newGrid[row][col + i] = {
                isOccupied: true,
                shipId: ship.id,
              };
            }
          }
        } else {
          for (let i = 0; i < ship.size; i++) {
            if (type === "bot") {
              newGrid[row + i][col] = {
                isOccupied: true,
                shipId: ship.id,
                isRevealed: false,
              };
            } else {
              newGrid[row + i][col] = {
                isOccupied: true,
                shipId: ship.id,
              };
            }
          }
        }

        return {
          ...ship,
          placed: true,
          position: { row, col },
          orientation,
        };
      }
    }

    return ship;
  };

  const placedShips = newShips.map((ship) => tryPlaceShip(ship));

  return { newGrid, placedShips };
};
