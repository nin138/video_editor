export const classNames = (...className: (string | undefined)[]) => {
  return className.filter((it) => !!it).join(' ');
};
