'use client';

import {
  useSensor,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import React, { PropsWithChildren } from 'react';
import DragOverlayWrapper from './drag-overlay-wrapper';

type Props = {};

export default function DndWrapper({ children }: PropsWithChildren<Props>) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  return (
    <DndContext sensors={sensors}>
      {children}

      <DragOverlayWrapper />
    </DndContext>
  );
}
