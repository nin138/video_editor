import React from "react";

export const SliderTrack: React.FC<any> = ({children, props}) => {
  return (
      <div
          {...props}
          style={{
              ...props.style,
              height: '6px',
              width: '100%',
              backgroundColor: '#ccc'
          }}
      >
          {children}
      </div>
  );
};

export const SliderThumb: React.FC<any> = ({props}) => {
    return (
        <div
            {...props}
            style={{
                ...props.style,
                height: '42px',
                width: '12px',
                backgroundColor: '#999'
            }}
        />
    );
};