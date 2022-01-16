import React from 'react';

export const Option: React.FC<{ display: boolean }> = ({
  display,
  children,
}) => {
  if (!display) return null;
  return <>{children}</>;
};
