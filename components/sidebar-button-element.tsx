'use client';

import React from 'react';
import { cn } from '@lib';
import { Button } from '@ui/button';
import { useDraggable } from '@dnd-kit/core';
import { FormElement } from './form-elements';

type Props = {
  element: FormElement;
};

export default function SidebarButtonElement({ element }: Props) {
  const { icon: Icon, label } = element.designerButtonElement;
  const dragabble = useDraggable({
    id: `designer-button-${element.type}`,
    data: {
      type: element.type,
      isDesignerButtonElement: true,
    },
  });

  return (
    <Button
      variant='outline'
      {...dragabble.listeners}
      {...dragabble.attributes}
      ref={dragabble.setNodeRef}
      className={cn('flex h-[120px] w-[120px] cursor-grab flex-col gap-2', {
        'ring-2 ring-primary': dragabble.isDragging,
      })}
    >
      <Icon className='h-8 w-8 cursor-grab text-primary' />
      <p className='text-xs'>{label}</p>
    </Button>
  );
}

export function SidebarButtonElementDragOverlay({ element }: Props) {
  const { icon: Icon, label } = element.designerButtonElement;

  return (
    <Button
      variant='outline'
      className='flex h-[120px] w-[120px] cursor-grab flex-col gap-2'
    >
      <Icon className='h-8 w-8 cursor-grab text-primary' />
      <p className='text-xs'>{label}</p>
    </Button>
  );
}
