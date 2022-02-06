import * as React from 'react';
import { DragLayer, DragSourceMonitor, XYCoord } from 'react-dnd';
import { DragLayerMonitor } from 'react-dnd/dist/types/types';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
};

function collect(monitor: DragLayerMonitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  };
}

interface Props {
  item: any;
  itemType: string;
  isDragging: boolean;
  currentOffset?: XYCoord;
}

class CustomDragLayer extends React.Component<Props> {
  getItemStyles(currentOffset?: XYCoord) {
    if (!currentOffset) {
      return {
        display: 'none',
      };
    }

    // move position
    const x = currentOffset.x;
    const y = currentOffset.y;
    const transform = `translate(${x}px, ${y}px) scale(1.05)`;

    return {
      WebkitTransform: transform,
      transform: transform,
    };
  }

  render() {
    const { item, itemType, isDragging, currentOffset } = this.props;

    if (!isDragging) {
      return null;
    }

    // render
    if (itemType === 'item') {
      return (
        <div style={layerStyles as any}>
          <div style={this.getItemStyles(currentOffset)}>{item.name}</div>
        </div>
      );
    }
    return null;
  }
}

export const WsDragLayer = DragLayer<any, any>(collect)(CustomDragLayer);
