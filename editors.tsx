// @ts-nocheck
import * as React from "react";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { Field, FieldRenderProps } from "@progress/kendo-react-form";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Error } from "@progress/kendo-react-labels";
import { GridCellProps } from "@progress/kendo-react-grid";

import { FormGridEditContext } from "./test2";

const FORM_DATA_INDEX = "formDataIndex";

const requiredValidator = (value) => (value ? "" : "The field is required");

const DisplayValue = (fieldRenderProps: FieldRenderProps) => {
  return <>{fieldRenderProps.value}</>;
};

const DropDownListWithValidation = (fieldRenderProps: FieldRenderProps) => {
  const { validationMessage, visited, options, ...others } = fieldRenderProps;
  console.log("others", others);
  return (
    <div>
      <DropDownList data={options} {...others} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const TextInputWithValidation = (fieldRenderProps: FieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const minValidator = (value) => (value >= 0 ? "" : "Minimum units 0");

const NumericTextBoxWithValidation = (fieldRenderProps: FieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  const anchor: any = React.useRef(null);
  return (
    <div>
      <NumericTextBox {...others} ref={anchor} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

export const NumberCell = (props: GridCellProps) => {
  const { parentField, editIndex } = React.useContext(FormGridEditContext);
  const isInEdit = props.dataItem[FORM_DATA_INDEX] === editIndex;

  return (
    <td>
      <Field
        component={isInEdit ? NumericTextBoxWithValidation : DisplayValue}
        name={`${parentField}[${props.dataItem[FORM_DATA_INDEX]}].${props.field}`}
        validator={minValidator}
      />
    </td>
  );
};

export const NameCell = (props: GridCellProps) => {
  const { parentField } = React.useContext(FormGridEditContext);

  return (
    <td>
      <Field
        component={TextInputWithValidation}
        name={`${parentField}[${props.dataItem[FORM_DATA_INDEX]}].${props.field}`}
        validator={requiredValidator}
      />
    </td>
  );
};

export const DropDownCell = (props) => {
  const { parentField } = React.useContext(FormGridEditContext);
  console.log("props, parentField", props, parentField);

  return (
    <td>
      <Field
        component={(fieldRenderProps: FieldRenderProps) => (
          <DropDownListWithValidation options={["AA", "BB"]} {...fieldRenderProps} />
        )}
        name={`${parentField}[${props.dataItem[FORM_DATA_INDEX]}].${props.field}`}
        validator={requiredValidator}
      />
    </td>
  );
};
