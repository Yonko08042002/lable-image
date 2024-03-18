import { Button, Carousel, Typography } from "antd";
import { useRef } from "react";

import "./App.css";
import { CarouselRef } from "antd/es/carousel";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import LabelingCanvas from "./LabelingCanvas";

export default function App() {
  const slider = useRef<CarouselRef>(null);
  interface DataType {
    key: string;
    src: string;
    alt: string;
  }

  const images = [
    {
      key: "1",
      src: "https://cdn.popsww.com/blog/sites/2/2022/03/Trafalgar-Law-full.jpg",
      alt: "law",
    },
    {
      key: "2",
      src: "https://accgroup.vn/wp-content/uploads/2022/01/civil-law-la-gi.jpg",
      alt: "law1",
    },
    {
      key: "3",
      src: "https://cdn.popsww.com/blog/sites/2/2022/03/Trafalgar-Law-full.jpg",
      alt: "1",
    },
  ];

  return (
    <div className="App">
      <div className="LeftSide">
        <Typography.Title>MIND SC</Typography.Title>
      </div>

      <div className="Main">
        <div className="CenterSide">
          <Carousel ref={slider}>
            {images.map((item) => (
              <div key={item.key}>
                <LabelingCanvas imageUrl={item.src} />
              </div>
            ))}
          </Carousel>
          <div className="Btns">
            <Button
              onClick={() => {
                if (slider.current) {
                  slider.current.prev();
                }
              }}
            >
              <LeftOutlined />
            </Button>
            <Button
              onClick={() => {
                if (slider.current) {
                  slider.current.next();
                }
              }}
            >
              <RightOutlined />
            </Button>
          </div>
        </div>
      </div>
      <div className="RightSide">
        <Typography.Title level={5}>Danh sách lỗi</Typography.Title>
      </div>
    </div>
  );
}
