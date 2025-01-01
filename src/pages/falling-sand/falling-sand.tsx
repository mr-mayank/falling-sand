//@ts-nocheck
import React, { useState, useRef, useCallback, useEffect } from "react";
import "../../assets/css/Grid.css";

const FallingSand = () => {
  const gridSize = 40;
  const containerSize = 400;
  const cellSize = containerSize / gridSize;
  const fallSpeed = 50;

  const [gridArray, setGridArray] = useState(
    Array.from({ length: gridSize }, () => Array(gridSize).fill(0))
  );

  const colors = ["first", "second", "third", "fourth"];
  const [selectedColor, setSelectedColor] = useState(3);
  const [isRunning, setIsRunning] = useState(false);

  const lastUpdateTime = useRef(0);
  const animationFrameId = useRef(null);
  const isDrawing = useRef(false);
  const cursorRef = useRef(null);

  const updateGrid = useCallback(() => {
    const currentTime = performance.now();
    if (currentTime - lastUpdateTime.current >= fallSpeed) {
      setGridArray((prevGrid) => {
        const newGrid = prevGrid.map((row) => [...row]);
        let hasChanged = false;

        for (let row = gridSize - 1; row >= 0; row--) {
          for (let col = 0; col < gridSize; col++) {
            if (newGrid[row][col] !== 0) {
              let below = row < gridSize - 1 ? newGrid[row + 1][col] : null;
              let direction = Math.random() < 0.5 ? -1 : 1;
              let belowSide =
                row < gridSize - 1 &&
                col + direction >= 0 &&
                col + direction < gridSize
                  ? newGrid[row + 1][col + direction]
                  : null;

              if (below === 0) {
                newGrid[row + 1][col] = newGrid[row][col];
                newGrid[row][col] = 0;
                hasChanged = true;
              } else if (belowSide === 0) {
                newGrid[row + 1][col + direction] = newGrid[row][col];
                newGrid[row][col] = 0;
                hasChanged = true;
              }
            }
          }
        }

        lastUpdateTime.current = currentTime;
        return hasChanged ? newGrid : prevGrid;
      });
    }

    animationFrameId.current = requestAnimationFrame(updateGrid);
  }, [gridSize, fallSpeed]);

  const handleDrawing = useCallback(
    (e) => {
      if (!isDrawing.current) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const colIndex = Math.floor(x / cellSize);
      const rowIndex = Math.floor(y / cellSize);

      if (
        rowIndex >= 0 &&
        rowIndex < gridSize &&
        colIndex >= 0 &&
        colIndex < gridSize &&
        gridArray[rowIndex][colIndex] === 0
      ) {
        setGridArray((prevGrid) => {
          const newGrid = prevGrid.map((row) => [...row]);
          newGrid[rowIndex][colIndex] = selectedColor + 1; // +1 because 0 is empty
          return newGrid;
        });

        if (!animationFrameId.current) {
          animationFrameId.current = requestAnimationFrame(updateGrid);
        }
      }
    },
    [gridArray, selectedColor, updateGrid, cellSize, gridSize]
  );

  const handleMouseDown = useCallback(() => {
    isDrawing.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsRunning(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(updateGrid);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updateGrid]);

  const updateCursorPosition = useCallback((e) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", updateCursorPosition);
    return () => {
      document.removeEventListener("mousemove", updateCursorPosition);
    };
  }, [updateCursorPosition]);

  return (
    <div className="center">
      <div className="grid-wrapper">
        <div className={`color-preview ${colors[selectedColor]}`} />
        <div className="grid-content">
          <div className="color-selector left">
            {colors.slice(0, 2).map((color, index) => (
              <div
                key={color}
                className={`color-option ${
                  selectedColor !== index ? "selected" : ""
                } ${color}`}
                onClick={() => setSelectedColor(index)}
              />
            ))}
          </div>
          <div
            className="grid-container"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
            }}
            onMouseMove={handleDrawing}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
          >
            {gridArray.map((row, rowIndex) =>
              row.map((value, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`grid-cell ${
                    value !== 0 ? colors[value - 1] : ""
                  }`}
                />
              ))
            )}
          </div>
          <div className="color-selector right">
            {colors.slice(2).map((color, index) => (
              <div
                key={color}
                className={`color-option ${
                  selectedColor !== index + 2 ? "selected" : ""
                } ${color}`}
                onClick={() => setSelectedColor(index + 2)}
              />
            ))}
          </div>
        </div>
      </div>
      {isRunning && (
        <>
          <div ref={cursorRef} className="custom-cursor" />
        </>
      )}
    </div>
  );
};

export default FallingSand;
