import React, { useState } from 'react';
import { useDesigner } from '@providers';
import { ElementsType, FormElements } from './form-elements';
import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { SidebarButtonElementDragOverlay } from './siderbar-button-element';

type Props = {};

export default function DragOverlayWrapper({}: Props) {
  const { elements } = useDesigner();
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart(event) {
      setDraggedItem(event.active);
    },
    onDragCancel() {
      setDraggedItem(null);
    },
    onDragEnd() {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) return null;

  let node = <div>No Drag Overlay</div>;

  const isSidebarButtonElement: boolean =
    draggedItem.data?.current?.isDesignerButtonElement;

  if (isSidebarButtonElement) {
    const type: ElementsType = draggedItem.data?.current?.type;
    node = <SidebarButtonElementDragOverlay element={FormElements[type]} />;
  }

  const isDesignerElement: boolean =
    draggedItem.data?.current?.isDesignerElement;
  if (isDesignerElement) {
    const elementId = draggedItem.data?.current?.id;
    const element = elements.find((element) => element.id === elementId);

    if (element) {
      const DesignerElementComponent =
        FormElements[element.type].designerComponent;

      node = (
        <div className='pointer-events-none flex h-[120px] w-full rounded-md border bg-accent px-4 py-2 opacity-80'>
          <DesignerElementComponent element={element} />
        </div>
      );
    }
  }

  return <DragOverlay>{node}</DragOverlay>;
}
