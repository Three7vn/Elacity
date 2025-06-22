import { useState, useRef, useEffect, useLayoutEffect } from 'react';

function DraggableWrapper({ children }) {
  const wrapperRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 100 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      const rect = wrapper.getBoundingClientRect();
      const x = Math.min(window.innerWidth - rect.width - 20, 20);
      const y = 100;
      setPosition({ x, y });
    }
  }, []);

  useEffect(() => {
    const moveHandler = (clientX, clientY) => {
      requestAnimationFrame(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const rect = wrapper.getBoundingClientRect();
        const newX = Math.max(0, Math.min(clientX - offset.x, window.innerWidth - rect.width));
        const newY = Math.max(0, Math.min(clientY - offset.y, window.innerHeight - rect.height));

        setPosition({ x: newX, y: newY });
      });
    };

    const handleMouseMove = (e) => isDragging && moveHandler(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        moveHandler(touch.clientX, touch.clientY);
      }
    };

    const stopDrag = () => {
      setIsDragging(false);
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', stopDrag);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', stopDrag);
    };
  }, [isDragging]);

  const handleStart = (clientX, clientY) => {
    const rect = wrapperRef.current.getBoundingClientRect();
    setOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
    setIsDragging(true);
    document.body.style.userSelect = 'none';
  };

  const handleMouseDown = (e) => handleStart(e.clientX, e.clientY);
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    }
  };

  return (
    <div
      ref={wrapperRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 9999,
        userSelect: 'none',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        touchAction: 'none',
      }}
    >
      {children}
    </div>
  );
}

export default DraggableWrapper;