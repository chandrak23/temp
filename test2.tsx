// @ts-nocheck
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Form, FieldArray, FormElement } from "@progress/kendo-react-form";

import { Error } from "@progress/kendo-react-labels";

import { clone } from "@progress/kendo-react-common";
import { Grid, GridCellProps, GridColumn, GridToolbar } from "@progress/kendo-react-grid";

import { DropDownCell, NameCell } from "./editors";

const sampleProducts = [
  {
    itemID: 1,
    columnName: "raw_name",
    operator: "LIKE",
    value: "US",
  },
];

const columnNames = ["column1", "column2"];

// Validate the entire Form
const arrayLengthValidator = (value: string | any[]) =>
  value && value.length ? "" : "Please add at least one record.";

// Create React.Context to pass props to the Form Field components from the main component
export const FormGridEditContext = React.createContext<{
  onRemove: (dataItem: any) => void;
  onEdit: (dataItem: any, isNew: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  editIndex: number | undefined;
  parentField: string;
}>({} as any);

const FORM_DATA_INDEX = "formDataIndex";
const DATA_ITEM_KEY = "itemID";

// Add a command cell to Edit, Update, Cancel and Delete an item
const CommandCell = (props: GridCellProps) => {
  const { onRemove, onEdit, onSave, onCancel, editIndex } = React.useContext(FormGridEditContext);
  const isInEdit = props.dataItem[FORM_DATA_INDEX] === editIndex;
  const isNewItem = !props.dataItem[DATA_ITEM_KEY];

  const onRemoveClick = React.useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      onRemove(props.dataItem);
    },
    [props.dataItem, onRemove]
  );

  const onEditClick = React.useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      onEdit(props.dataItem, isNewItem);
    },
    [props.dataItem, onEdit, isNewItem]
  );

  const onSaveClick = React.useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      onSave();
    },
    [onSave]
  );

  const onCancelClick = React.useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      onCancel();
    },
    [onCancel]
  );

  return isInEdit ? (
    <td className="k-command-cell">
      {/* <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-save-command"
        onClick={onSaveClick}
      >
        {isNewItem ? "Add" : "Update"}
      </button> */}
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command"
        onClick={isNewItem ? onRemoveClick : onCancelClick}
      >
        {isNewItem ? "Remove" : "Cancel"}
      </button>
    </td>
  ) : (
    <td className="k-command-cell">
      {/* <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary k-grid-edit-command"
        onClick={onEditClick}
      >
        Edit
      </button> */}
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-remove-command"
        onClick={onRemoveClick}
      >
        Remove
      </button>
    </td>
  );
};

// Create the Grid that will be used inside the Form
const FormGrid = (fieldArrayRenderProps: unknown) => {
  const { validationMessage, visited, name, dataItemKey } = fieldArrayRenderProps;
  const [editIndex, setEditIndex] = React.useState<number | undefined>();
  const editItemCloneRef = React.useRef();

  // Add a new item to the Form FieldArray that will be shown in the Grid
  const onAdd = React.useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      fieldArrayRenderProps.onPush({
        value: {
          columnName: "raw_name1",
          operator: "LIKE1",
          value: "US1",
        },
      });

      //   setEditIndex(0);
    },
    [fieldArrayRenderProps]
  );
  // Remove a new item to the Form FieldArray that will be removed from the Grid
  const onRemove = React.useCallback(
    (dataItem: { [x: string]: any }) => {
      fieldArrayRenderProps.onRemove({
        index: dataItem[FORM_DATA_INDEX],
      });

      setEditIndex(undefined);
    },
    [fieldArrayRenderProps]
  );

  // Update an item from the Grid and update the index of the edited item
  const onEdit = React.useCallback(
    (dataItem: { [x: string]: React.SetStateAction<number | undefined> }, isNewItem: any) => {
      if (!isNewItem) {
        editItemCloneRef.current = clone(dataItem);
      }

      setEditIndex(dataItem[FORM_DATA_INDEX]);
    },
    []
  );

  // Cancel the editing of an item and return its initial value
  const onCancel = React.useCallback(() => {
    if (editItemCloneRef.current) {
      fieldArrayRenderProps.onReplace({
        index: editItemCloneRef.current[FORM_DATA_INDEX],
        value: editItemCloneRef.current,
      });
    }

    editItemCloneRef.current = undefined;
    setEditIndex(undefined);
  }, [fieldArrayRenderProps]);

  // Save the changes
  const onSave = React.useCallback(() => {
    console.log(fieldArrayRenderProps);
    setEditIndex(undefined);
  }, [fieldArrayRenderProps]);

  const dataWithIndexes = fieldArrayRenderProps.value.map((item: any, index: any) => {
    return { ...item, [FORM_DATA_INDEX]: index };
  });

  return (
    <FormGridEditContext.Provider
      value={{
        onCancel,
        onEdit,
        onRemove,
        onSave,
        editIndex,
        parentField: name,
      }}
    >
      {visited && validationMessage && <Error>{validationMessage}</Error>}
      <Grid data={dataWithIndexes} dataItemKey={dataItemKey}>
        <GridToolbar>
          <button
            title="Add new"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            onClick={onAdd}
          >
            Add new
          </button>
        </GridToolbar>
        <GridColumn
          field="columnName"
          title="Column"
          cell={(props) => <DropDownCell options={["colmm", "asdd"]} {...props} />}
        />
        <GridColumn field="operator" title="Operator" cell={DropDownCell} />
        <GridColumn field="value" title="Value" cell={NameCell} />
        <GridColumn cell={CommandCell} width="240px" />
      </Grid>
    </FormGridEditContext.Provider>
  );
};

export const App = () => {
  const handleSubmit = (dataItem: any) => alert(JSON.stringify(dataItem));

  return (
    <Form
      initialValues={{
        products: sampleProducts,
      }}
      onSubmit={handleSubmit}
      render={(formRenderProps) => (
        <FormElement>
          <FieldArray
            name="products"
            dataItemKey={DATA_ITEM_KEY}
            component={FormGrid}
            validator={arrayLengthValidator}
          />
          <div className="k-form-buttons">
            <button
              type={"submit"}
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              disabled={!formRenderProps.allowSubmit}
            >
              Submit
            </button>
          </div>
        </FormElement>
      )}
    />
  );
};

export default App;
