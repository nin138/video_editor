import React, { CSSProperties } from 'react';
import { XYCoord, useDragLayer } from 'react-dnd';
import { DragItemType, WsVideoDroppable } from './workspaceDraggable';
import { WsVideoView } from './Draggable/WsVideoView';

const layerStyles: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

  let { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export interface CustomDragLayerProps {}

interface CollectedProps {
  item: WsVideoDroppable;
  initialOffset: XYCoord | null;
  currentOffset: XYCoord | null;
  isDragging: boolean;
}

export const CustomDragLayer: React.VFC<CustomDragLayerProps> = (props) => {
  const { isDragging, item, initialOffset, currentOffset } =
    useDragLayer<CollectedProps>((monitor) => ({
      item: monitor.getItem(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  if (!isDragging) {
    return null;
  }

  const renderItem = () => {
    switch (item.type) {
      case DragItemType.WorkspaceVideo:
        return (
          <WsVideoView
            name={item.video.fileName()}
            color={'#f00'}
            width={100}
          />
        );
    }
    return 'hhhhwwww';
  };

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </div>
    </div>
  );
};