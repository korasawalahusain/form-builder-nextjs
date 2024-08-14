'use client';

import {
  useState,
  Dispatch,
  useEffect,
  useContext,
  createContext,
  SetStateAction,
  PropsWithChildren,
} from 'react';
import { FormElementInstance, DndWrapper } from '@components';

type DesignerContextType = {
  elements: FormElementInstance[];
  setElements: Dispatch<SetStateAction<FormElementInstance[]>>;

  removeElement: (id: string) => void;
  addElement: (index: number, element: FormElementInstance) => void;
  updateElement: (id: string, element: FormElementInstance) => void;

  selectedElement: FormElementInstance | null;
  setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;
};

const DesignerContext = createContext({} as DesignerContextType);

type Props = {
  formContent: string;
};

export default function Provider({
  children,
  formContent,
}: PropsWithChildren<Props>) {
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance | null>(null);
  const [elements, setElements] = useState<FormElementInstance[]>([]);

  useEffect(() => {
    setSelectedElement(null);
    setElements(JSON.parse(formContent));
  }, [formContent, setElements, setSelectedElement]);

  function addElement(index: number, element: FormElementInstance) {
    setElements((prev) => {
      const elements = [...prev];
      elements.splice(index, 0, element);
      return elements;
    });
  }

  function updateElement(id: string, newElement: FormElementInstance) {
    setElements((prev) => {
      const elements = [...prev];
      const element = elements.findIndex((element) => element.id === id);
      if (element === -1) return elements;

      elements[element] = newElement;
      return elements;
    });
  }

  function removeElement(id: string) {
    setElements((prev) => prev.filter((element) => element.id !== id));
  }

  return (
    <DesignerContext.Provider
      value={{
        elements,
        setElements,
        addElement,
        updateElement,
        removeElement,
        selectedElement,
        setSelectedElement,
      }}
    >
      <DndWrapper>{children}</DndWrapper>
    </DesignerContext.Provider>
  );
}

export function useDesigner() {
  const context = useContext(DesignerContext);

  if (!context) {
    throw new Error('useDesigner must be used within a DesignerProvider');
  }

  return context;
}
