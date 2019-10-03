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
          width: 100%;
          height: 500px;
        }
      `}</style>
    </div>
  );
}
