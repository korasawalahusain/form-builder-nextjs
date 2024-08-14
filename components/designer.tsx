'use client';

import {
  ElementsType,
  FormElements,
  FormElementInstance,
} from './form-elements';
import React from 'react';
import { Button } from '@ui/button';
import { cn, isGenerator } from '@lib';
import { useDesigner } from '@providers';
import { BiSolidTrash } from 'react-icons/bi';
import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core';

type Props = {};

export default function Designer({}: Props) {
  const { elements, addElement, removeElement, setSelectedElement } =
    useDesigner();

  const droppable = useDroppable({
    id: 'designer-drop-area',
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd(event) {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerButtonElement =
        active.data?.current?.isDesignerButtonElement;

      // First Senario
      const isDroppingOverDesignerDropArea =
        over.data?.current?.isDesignerDropArea;

      if (isDesignerButtonElement && isDroppingOverDesignerDropArea) {
        const type: ElementsType = active.data?.current?.type;
        const newElement = FormElements[type].construct(isGenerator());

        addElement(elements.length, newElement);
      }

      // Second Senario
      const isDroppingOverDesignerElement =
        over.data?.current?.isTopHalfDesignerElement ||
        over.data?.current?.isBottomHalfDesignerElement;

      if (isDesignerButtonElement && isDroppingOverDesignerElement) {
        const type: ElementsType = active.data?.current?.type;
        const newElement = FormElements[type].construct(isGenerator());

        const overElementId = over.data?.current?.id;
        const overElementIndex = elements.findIndex(
          (element) => element.id === overElementId,
        );
        const newElementIndex = over.data?.current?.isTopHalfDesignerElement
          ? overElementIndex
          : overElementIndex + 1;

        addElement(newElementIndex, newElement);
      }

      // Third Senario
      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;

      if (isDroppingOverDesignerElement && isDraggingDesignerElement) {
        const activeElementId = active.data?.current?.id;
        const overElementId = over.data?.current?.id;

        const activeElementIndex = elements.findIndex(
          (element) => element.id === activeElementId,
        );
        const overElementIndex = elements.findIndex(
          (element) => element.id === overElementId,
        );

        const activeElement = {
          ...elements[activeElementIndex],
        };
        removeElement(activeElement.id);

        const newElementIndex = over.data?.current?.isTopHalfDesignerElement
          ? overElementIndex
          : overElementIndex + 1;

        addElement(newElementIndex, activeElement);
      }
    },
  });

  return (
    <div className='w-full p-4' onClick={() => setSelectedElement(null)}>
      <div
        ref={droppable.setNodeRef}
        className={cn(
          'm-auto flex h-full max-w-[920px] flex-1 flex-grow flex-col items-center justify-start overflow-y-auto rounded-xl bg-background',
          {
            'ring-2 ring-inset ring-primary/20': droppable.isOver,
          },
        )}
      >
        {elements.length === 0 &&
          (droppable.isOver ? (
            <div className='w-full p-4'>
              <div className='h-[120px] rounded-md bg-primary/20' />
            </div>
          ) : (
            <p className='flex flex-grow items-center text-3xl font-bold text-muted-foreground'>
              Drop here
            </p>
          ))}

        {elements.length > 0 && (
          <div className='flex w-full flex-col gap-2 p-4'>
            {elements.map((element, index) => (
              <DesignerElementWrapper key={index} element={element} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type DesignerElementWrapperProps = {
  element: FormElementInstance;
};

function DesignerElementWrapper({ element }: DesignerElementWrapperProps) {
  const DesignerElement = FormElements[element.type].designerComponent;

  const { removeElement, setSelectedElement } = useDesigner();

  const draggable = useDraggable({
    id: `${element.id}-drag-handler`,
    data: {
      id: element.id,
      type: element.type,
      isDesignerElement: true,
    },
  });
  const topHalf = useDroppable({
    id: `${element.id}-top`,
    data: {
      id: element.id,
      type: element.type,
      isTopHalfDesignerElement: true,
    },
  });
  const bottomHalf = useDroppable({
    id: `${element.id}-bottom`,
    data: {
      id: element.id,
      type: element.type,
      isBottomHalfDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;

  return (
    <div
      {...draggable.listeners}
      {...draggable.attributes}
      ref={draggable.setNodeRef}
      onClick={(event) => {
        event.stopPropagation();
        setSelectedElement(element);
      }}
      className='group relative flex h-[120px] flex-col rounded-md text-foreground ring-1 ring-inset ring-accent hover:cursor-pointer'
    >
      <div className='absolute inset-0 z-20 hidden h-full w-full animate-pulse flex-row items-center justify-center group-hover:flex'>
        <p className='text-sm text-muted-foreground'>
          Click for properties or drag to move
        </p>
      </div>
      <Button
        variant='outline'
        onClick={(event) => {
          event.stopPropagation();
          setSelectedElement(null);
          removeElement(element.id);
        }}
        className='absolute inset-y-0 right-0 z-30 hidden h-full justify-center rounded-md rounded-l-none border bg-red-500 group-hover:flex'
      >
        <BiSolidTrash className='h-6 w-6' />
      </Button>

      <div ref={topHalf.setNodeRef} className='absolute top-0 h-1/2 w-full' />
      {topHalf.isOver && (
        <div className='absolute top-0 z-10 h-[7px] w-full rounded-md rounded-b-none bg-primary'></div>
      )}

      <div className='pointer-events-none flex h-[120px] w-full items-center rounded-md bg-accent/40 px-4 py-2 group-hover:opacity-30'>
        <DesignerElement element={element} />
      </div>

      <div
        ref={bottomHalf.setNodeRef}
        className='absolute bottom-0 h-1/2 w-full'
      />
      {bottomHalf.isOver && (
        <div className='absolute bottom-0 z-10 h-[7px] w-full rounded-md rounded-t-none bg-primary'></div>
      )}
    </div>
  );
}
