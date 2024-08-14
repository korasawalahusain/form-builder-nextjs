import {
  TextFieldFormElement,
  DateFieldFormElement,
  SelectFieldFormElement,
  NumberFieldFormElement,
  CheckboxFieldFormElement,
  TextAreaFieldFormElement,
  TitleFieldFormElement,
  SpacerFieldFormElement,
  SubTitleFieldFormElement,
  ParagraphFieldFormElement,
  SeparatorFieldFormElement,
} from './fields/index';
import { FC } from 'react';
import { IconType } from 'react-icons/lib';

export type ElementsType =
  | 'TextField'
  | 'DateField'
  | 'NumberField'
  | 'SelectField'
  | 'CheckboxField'
  | 'TextAreaField'
  | 'TitleField'
  | 'SpacerField'
  | 'SubTitleField'
  | 'ParagraphField'
  | 'SeparatorField';

export type DesignerComponentProps<T = any> = {
  element: FormElementInstance<T>;
};

export type PropertiesComponentProps<T = any> = {
  element: FormElementInstance<T>;
};

export type FormComponentProps<T = any> = {
  isInvalid?: boolean;
  defaultValue?: string;
  element: FormElementInstance<T>;
  onChange?: (newValue: string) => void;
};

export type FormElement<T = any> = {
  type: ElementsType;
  designerButtonElement: {
    label: string;
    icon: IconType;
  };
  formComponent: FC<FormComponentProps<T>>;
  designerComponent: FC<DesignerComponentProps<T>>;
  construct: (id: string) => FormElementInstance<T>;
  propertiesComponent: FC<PropertiesComponentProps<T>>;
  validate: (element: FormElementInstance<T>, currentValue?: string) => boolean;
};

export type FormElementInstance<T = any> = {
  id: string;
  type: ElementsType;
  extraAttributes: T;
};

export type FormElementsType = {
  [key in ElementsType]: FormElement;
};

export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
  DateField: DateFieldFormElement,
  SelectField: SelectFieldFormElement,
  NumberField: NumberFieldFormElement,
  CheckboxField: CheckboxFieldFormElement,
  TextAreaField: TextAreaFieldFormElement,
  TitleField: TitleFieldFormElement,
  SpacerField: SpacerFieldFormElement,
  SubTitleField: SubTitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
};
