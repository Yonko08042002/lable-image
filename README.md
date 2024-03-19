# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

import React, { useState, useEffect } from "react";
import { Stage, Layer, Image, Rect, Text } from "react-konva";

const CVAT: React.FC = () => {
const [selectedLabel, setSelectedLabel] = useState<string>("");
const [boundingBoxes, setBoundingBoxes] = useState<
{ x: number; y: number; width: number; height: number; label: string }[]

> ([]);
> const [isDrawing, setIsDrawing] = useState<boolean>(false);
> const [drawingRegion, setDrawingRegion] = useState<{

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
const stageRef = React.useRef<any>(null);

useEffect(() => {
const image = new window.Image();
image.src =
"https://cdn.popsww.com/blog/sites/2/2022/03/Trafalgar-Law-full.jpg";
image.onload = () => {
setImageObj(image);
};
}, []);

const [imageObj, setImageObj] = useState<HTMLImageElement | undefined>(
undefined
);

const handleStageMouseDown = () => {
const stage = stageRef.current;
const pointerPos = stage.getPointerPosition();
setDrawingRegion({
startX: pointerPos.x,
startY: pointerPos.y,
endX: pointerPos.x,
endY: pointerPos.y,
});
setIsDrawing(true);
};

const handleStageMouseUp = () => {
setIsDrawing(false);
if (selectedLabel && drawingRegion) {
const stage = stageRef.current;
const pointerPos = stage.getPointerPosition();
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
if (!isDrawing) return;
const stage = stageRef.current;
const pointerPos = stage.getPointerPosition();
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

return (
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
<div>
<p>Select a label:</p>
<button onClick={() => handleLabelSelection("Label 1")}>Label 1</button>
<button onClick={() => handleLabelSelection("Label 2")}>Label 2</button>
<button onClick={() => handleLabelSelection("Label 3")}>Label 3</button>
</div>
</div>
);
};

export default CVAT;
