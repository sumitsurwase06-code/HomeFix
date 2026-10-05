import React from 'react';
import './Skeleton.css';

export default function Skeleton({ 
  variant = 'text', 
  width, 
  height, 
  borderRadius,
  className = '',
  count = 1,
  style = {} 
}) {
  const elements = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`skeleton skeleton-${variant} ${className}`}
      style={{
        width: width || (variant === 'circle' ? height : undefined),
        height: height || (variant === 'circle' ? width : undefined),
        borderRadius: borderRadius || undefined,
        ...style
      }}
      aria-hidden="true"
    />
  ));

  return count === 1 ? elements[0] : <div className="skeleton-group">{elements}</div>;
}
