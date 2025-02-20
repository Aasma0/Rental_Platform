import React, { useEffect, useRef } from "react";

const StatsSection = () => {
  const countersRef = useRef([]);

  useEffect(() => {
    const animateCount = (counter) => {
      const target = +counter.getAttribute("data-target");
      let count = 0;
      const speed = 200;
      const increment = target / speed;

      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target;
        }
      };

      updateCount();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    countersRef.current.forEach((counter) => {
      if (counter) observer.observe(counter);
    });
  }, []);

  return (
    <div className="stats-section flex justify-around mb-32">
      <div>
        <h3>Properties Listed</h3>
        <div ref={(el) => countersRef.current.push(el)} data-target="1050">0</div>
      </div>
      <div>
        <h3>Happy Customers</h3>
        <div ref={(el) => countersRef.current.push(el)} data-target="3000">0</div>
      </div>
      <div>
        <h3>Sold Properties</h3>
        <div ref={(el) => countersRef.current.push(el)} data-target="1500">0</div>
      </div>
    </div>
  );
};

export default StatsSection;
