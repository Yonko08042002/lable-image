import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

interface LabelingCanvasProps {
  imageUrl: string;
}

const LabelingCanvas: React.FC<LabelingCanvasProps> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current);

      fabric.Image.fromURL(imageUrl, (img) => {
        canvas.setWidth(img.width || 0);
        canvas.setHeight(img.height || 0);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });

      canvas.on("mouse:down", (event) => {
        if (!event.target) {
          const pointer = canvas.getPointer(event.e);
          const rect = new fabric.Rect({
            left: pointer.x - 50,
            top: pointer.y - 50,
            width: 100,
            height: 100,
            fill: "transparent",
            stroke: "red",
            strokeWidth: 2,
          });
          canvas.add(rect);
          canvas.renderAll();
        }
      });

      canvas.on("object:selected", (event) => {
        const obj = event.target as fabric.Object;
        console.log("Selected object: ", obj);
        // Xử lý khi đối tượng được chọn
      });
    }
  }, [imageUrl]);

  return <canvas ref={canvasRef} />;
};

export default LabelingCanvas;
