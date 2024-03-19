import React, { useState, useRef } from "react";
import { Stage, Layer, Image, Rect, Text } from "react-konva";

const CVAT: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [boundingBoxes, setBoundingBoxes] = useState<
    { x: number; y: number; width: number; height: number; label: string }[]
  >([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawingRegion, setDrawingRegion] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const [labelColors, setLabelColors] = useState<{ [key: string]: string }>({
    "Label 1": "red",
    "Label 2": "blue",
    "Label 3": "green",
  });
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const stageRef = useRef<any>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (result && typeof result === "string") {
          const img = new window.Image();
          img.src = result;
          img.onload = () => {
            setImageObj(img);
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStageMouseDown = () => {
    if (isPaused || !stageRef.current) return; // Check if stageRef.current exists
    const pointerPos = stageRef.current.getPointerPosition();
    if (pointerPos) {
      setDrawingRegion({
        startX: pointerPos.x,
        startY: pointerPos.y,
        endX: pointerPos.x,
        endY: pointerPos.y,
      });
      setIsDrawing(true);
    }
  };

  const handleStageMouseUp = () => {
    setIsDrawing(false);
    if (selectedLabel && drawingRegion && !isPaused && stageRef.current) {
      const pointerPos = stageRef.current.getPointerPosition();
      if (pointerPos) {
        const newBoundingBox = {
          x: Math.min(drawingRegion.startX, pointerPos.x),
          y: Math.min(drawingRegion.startY, pointerPos.y),
          width: Math.abs(pointerPos.x - drawingRegion.startX),
          height: Math.abs(pointerPos.y - drawingRegion.startY),
          label: selectedLabel,
        };
        setBoundingBoxes([...boundingBoxes, newBoundingBox]);
        setDrawingRegion(null);
      }
    }
  };

  const handleMouseMove = () => {
    if (!isDrawing || isPaused || !stageRef.current) return; // Check if stageRef.current exists
    const pointerPos = stageRef.current.getPointerPosition();
    if (pointerPos) {
      setDrawingRegion((prevRegion) => {
        if (prevRegion) {
          return { ...prevRegion, endX: pointerPos.x, endY: pointerPos.y };
        }
        return prevRegion;
      });
    }
  };

  const handleLabelSelection = (label: string) => {
    setSelectedLabel(label);
  };

  // const handlePause = () => {
  //   setIsPaused((prevState) => !prevState);
  // };
  const handlePause = () => {
    setIsPaused((prevState) => {
      if (!prevState) {
        boundingBoxes.forEach((box, index) => {
          console.log(`Label: ${box.label}, X: ${box.x}, Y: ${box.y}`);
        });
      }
      return !prevState;
    });
  };
  const handleDeleteAllLabels = () => {
    setBoundingBoxes([]);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <div>
        <Stage
          width={800}
          height={600}
          onMouseDown={handleStageMouseDown}
          onMouseUp={handleStageMouseUp}
          onMouseMove={handleMouseMove}
          ref={stageRef}
        >
          <Layer>
            {imageObj && <Image image={imageObj} width={800} height={600} />}
            {boundingBoxes.map((box, index) => (
              <React.Fragment key={index}>
                <Rect
                  x={box.x}
                  y={box.y}
                  width={box.width}
                  height={box.height}
                  stroke={labelColors[box.label]}
                  strokeWidth={2}
                />
                <Text
                  text={box.label}
                  x={box.x}
                  y={box.y - 20}
                  fill={labelColors[box.label]}
                />
              </React.Fragment>
            ))}
            {drawingRegion && (
              <Rect
                x={drawingRegion.startX}
                y={drawingRegion.startY}
                width={drawingRegion.endX - drawingRegion.startX}
                height={drawingRegion.endY - drawingRegion.startY}
                stroke={labelColors[selectedLabel]}
                strokeWidth={2}
              />
            )}
          </Layer>
        </Stage>
      </div>
      <div>
        <p>Select a label:</p>
        <button onClick={() => handleLabelSelection("Label 1")}>Label 1</button>
        <button onClick={() => handleLabelSelection("Label 2")}>Label 2</button>
        <button onClick={() => handleLabelSelection("Label 3")}>Label 3</button>
        {/* Add more labels as needed */}
      </div>
      <div>
        <button onClick={handlePause}>{isPaused ? "Resume" : "Pause"}</button>
        <button onClick={handleDeleteAllLabels}>Xóa tất cả các nhãn</button>
      </div>
    </div>
  );
};

export default CVAT;
