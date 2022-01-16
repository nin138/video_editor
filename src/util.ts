export const classNames = (...className: string[]) => {
    return className.filter(it => !!it).join(' ');
};
