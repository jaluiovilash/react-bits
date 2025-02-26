// import Masonry from "./Masonry";

// const data = [
//   { id: 1, image: "https://picsum.photos/id/10/200/300", height: 400 },
//   { id: 2, image: "https://picsum.photos/id/14/200/300", height: 300 },
//   { id: 3, image: "https://picsum.photos/id/15/200/300", height: 300 },
//   { id: 4, image: "https://picsum.photos/id/16/200/300", height: 300 },
//   { id: 5, image: "https://picsum.photos/id/17/200/300", height: 300 },
//   { id: 6, image: "https://picsum.photos/id/19/200/300", height: 300 },
//   { id: 7, image: "https://picsum.photos/id/37/200/300", height: 200 },
//   { id: 8, image: "https://picsum.photos/id/39/200/300", height: 300 },
//   { id: 9, image: "https://picsum.photos/id/85/200/300", height: 200 },
//   { id: 10, image: "https://picsum.photos/id/103/200/300", height: 400 }
// ];

// <Masonry data={data} />;
import { useState, useEffect, useMemo, useRef } from "react";
import { useTransition, a } from "@react-spring/web";

function Masonry({ data }) {
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      if (window.matchMedia("(min-width: 1500px)").matches) {
        setColumns(5);
      } else if (window.matchMedia("(min-width: 1000px)").matches) {
        setColumns(4);
      } else if (window.matchMedia("(min-width: 600px)").matches) {
        setColumns(3);
      } else {
        setColumns(1); // Mobile devices
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const ref = useRef();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [heights, gridItems] = useMemo(() => {
    let heights = new Array(columns).fill(0);
    let gridItems = data.map((child) => {
      const column = heights.indexOf(Math.min(...heights));
      const x = (width / columns) * column;
      const y = (heights[column] += child.height / 2) - child.height / 2;
      return {
        ...child,
        x,
        y,
        width: width / columns,
        height: child.height / 2
      };
    });
    return [heights, gridItems];
  }, [columns, data, width]);

  const transitions = useTransition(gridItems, {
    keys: (item) => item.id,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25
  });

  return (
    <div
      ref={ref}
      className="relative w-full h-full"
      style={{ height: Math.max(...heights) }}
    >
      {transitions((style, item) => (
        <a.div
          key={item.id}
          style={style}
          className="absolute p-[15px] [will-change:transform,width,height,opacity]"
        >
          <div
            className="relative w-full h-full overflow-hidden uppercase text-[10px] leading-[10px] rounded-[4px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] transition duration-300 ease hover:scale-110"
            style={{
              backgroundColor: "#ffffff",
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
        </a.div>
      ))}
    </div>
  );
}

export default Masonry;
