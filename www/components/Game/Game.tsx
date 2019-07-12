import React, {useEffect, useRef} from 'react';
import Yayaya from "./index";

export default function Game({ store, startTime }) {
  const wrapper = useRef<HTMLDivElement>();
  useEffect(() => {
    const ya = new Yayaya(wrapper.current, startTime, store);
    ya.init();
  }, []);
  return (
    <div className="wrapper" ref={wrapper}>
      <style jsx>{`
        .wrapper {
          width: 500px;
          height: 500px;
          border: 1px solid black;
        }
      `}</style>
    </div>
  );
}
