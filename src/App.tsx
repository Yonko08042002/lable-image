import { Button, Carousel, Typography } from "antd";

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image, Rect, Text } from "react-konva";

import "./App.css";
import { CarouselRef } from "antd/es/carousel";
import {
  CaretRightOutlined,
  DeleteOutlined,
  LeftOutlined,
  PauseOutlined,
  RightOutlined,
} from "@ant-design/icons";

export default function App() {
  const slider = useRef<CarouselRef>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [boundingBoxes, setBoundingBoxes] = useState<
    Array<
      Array<{
        x: number;
        y: number;
        width: number;
        height: number;
        label: string;
      }>
    >
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
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    const imagePaths = [
      "https://cdn.popsww.com/blog/sites/2/2022/03/Trafalgar-Law-full.jpg",
      "https://accgroup.vn/wp-content/uploads/2022/01/civil-law-la-gi.jpg",
      "https://images.fbox.fpt.vn/wordpress-blog/2023/08/tat-ca-thong-tin-ve-luffy.jpg",
    ];

    Promise.all(imagePaths.map(loadImage)).then((loadedImages) => {
      setImages(loadedImages);
      // Initialize boundingBoxes state
      setBoundingBoxes(new Array(loadedImages.length).fill([]));
    });
  }, []);

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = (err: any) => reject(err);
      img.src = url;
    });
  };

  const handleStageMouseDown = () => {
    if (isPaused || !stageRef.current) return;
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
        setBoundingBoxes((prevBoxes) => {
          const newBoxes = [...prevBoxes];
          newBoxes[currentImageIndex] = [
            ...newBoxes[currentImageIndex],
            newBoundingBox,
          ];
          return newBoxes;
        });
        setDrawingRegion(null);
      }
    }
  };

  const handleMouseMove = () => {
    if (!isDrawing || isPaused || !stageRef.current) return;
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

  const handlePause = () => {
    setIsPaused((prevState) => {
      if (!prevState) {
        boundingBoxes.forEach((boxes, index) => {
          console.log(`Image ${index + 1} bounding boxes:`);
          boxes.forEach((box) => {
            console.log(`Label: ${box.label}, X: ${box.x}, Y: ${box.y}`);
          });
        });
      }
      return !prevState;
    });
  };

  const handleDeleteAllLabels = () => {
    setBoundingBoxes((prevBoxes) => {
      const newBoxes = [...prevBoxes];
      newBoxes[currentImageIndex] = [];
      return newBoxes;
    });
  };

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      console.log("hello");
    }
  };

  return (
    <div className="App">
      <div className="LeftSide">
        <Typography.Title>MIND SC</Typography.Title>
        <div className="list-images">
          {images.map((_, index) => (
            <button key={index} onClick={() => handleImageChange(index)}>
              Image {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="Main">
        <div className="CenterSide">
          <Stage
            width={600}
            height={300}
            onMouseDown={handleStageMouseDown}
            onMouseUp={handleStageMouseUp}
            onMouseMove={handleMouseMove}
            ref={stageRef}
          >
            <Layer>
              {images.map((image, index) => (
                <Image
                  key={index}
                  image={image}
                  width={600}
                  height={300}
                  visible={index === currentImageIndex}
                />
              ))}
              {boundingBoxes[currentImageIndex] &&
                boundingBoxes[currentImageIndex].map((box, index) => (
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
          <div className="Btns">
            <Button onClick={handlePreviousImage}>
              <LeftOutlined />
            </Button>
            <Button onClick={handlePause}>
              {isPaused ? <CaretRightOutlined /> : <PauseOutlined />}
            </Button>
            <Button onClick={handleDeleteAllLabels}>
              <DeleteOutlined />
            </Button>
            <Button onClick={handleNextImage}>
              <RightOutlined />
            </Button>
          </div>
        </div>
      </div>
      <div className="RightSide">
        <Typography.Title level={5}>Danh sách lỗi</Typography.Title>
        <div className="list-lables">
          <button onClick={() => handleLabelSelection("Label 1")}>
            Label 1
          </button>
          <button onClick={() => handleLabelSelection("Label 2")}>
            Label 2
          </button>
          <button onClick={() => handleLabelSelection("Label 3")}>
            Label 3
          </button>
        </div>
      </div>
    </div>
  );
}
