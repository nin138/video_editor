import Base, { ScrollContainerProps } from 'react-indiana-drag-scroll';
import React from 'react';

interface Props extends ScrollContainerProps {
  targetElementClass: string;
}

class ScrollContainer2 extends Base {
  private targetElementClass: string;
  constructor(props: Props) {
    super(props);
    this.targetElementClass = props.targetElementClass;
  }

  isDraggable(target: HTMLElement) {
    const ignoreElements = this.props.ignoreElements;
    if (this.targetElementClass && !target.classList.contains(this.targetElementClass)) return false;

    if (ignoreElements) {
      const closest = target.closest(ignoreElements);
      return closest === null || closest.contains(this.getElement());
    } else {
      return true;
    }
  }
}

export const DraggableScrollContainer = ScrollContainer2 as unknown as React.FC<Props>;
