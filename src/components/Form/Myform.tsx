import * as React from "react";
import * as ReactDOM from "react-dom";
import { Form, Field, FormElement, FormRenderProps } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import "./myform.scss";

import {
  FormDatePicker,
  FormNumericTextBox,
  FormInput,
  FormCheckbox,
  FormTextArea,
  FormDropDownList,
} from "./form-components";

import {
  termsValidator,
  emailValidator,
  nameValidator,
  phoneValidator,
  guestsValidator,
  nightsValidator,
  arrivalDateValidator,
} from "./validators";

const SampleForm = () => {
  const handleSubmit = (dataItem: { [name: string]: any }) =>
    alert(JSON.stringify(dataItem, null, 2));
  return (
    <Form
      onSubmit={handleSubmit}
      render={(formRenderProps: FormRenderProps) => (
        <FormElement>
          <fieldset className={"k-form-fieldset register-data-source-form"}>
            <legend className={"k-form-legend"}>Register Data Source</legend>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Field
                className={"form-x"}
                id={"name"}
                name={"name"}
                label={"Name"}
                component={FormInput}
                validator={nameValidator}
              />
              <Field
                style={{ width: "45%" }}
                id={"uid"}
                name={"uid"}
                label={"UID"}
                component={FormInput}
                // validator={nameValidator}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Field
                id={"type"}
                name={"type"}
                label={"Type"}
                component={FormDropDownList}
                // validator={nameValidator}
              />
              <Field
                id={"password"}
                name={"password"}
                label={"Password"}
                component={FormDropDownList}
                // validator={nameValidator}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Field
                id={"description"}
                name={"description"}
                label={"Description"}
                component={FormTextArea}
                // validator={nameValidator}
              />
              <Field
                id={"connection"}
                name={"connection"}
                label={"Connection"}
                component={FormInput}
                hint={"Hint: oracle/ttg"}
                // validator={nameValidator}
              />
            </div>

            <Field
              id={"tags"}
              name={"tags"}
              label={"Tags"}
              component={FormInput}
              // validator={nameValidator}
            />

            <span className={"k-form-separator"} />
            <Field
              id={"terms"}
              name={"terms"}
              label={"I agree with terms and conditions"}
              component={FormCheckbox}
              validator={termsValidator}
            />
            <div className="k-form-buttons">
              <Button
                themeColor={"primary"}
                type={"submit"}
                disabled={!formRenderProps.allowSubmit}
              >
                Send Reservation Request
              </Button>
              <Button onClick={formRenderProps.onFormReset}>Clear</Button>
            </div>
          </fieldset>
        </FormElement>
      )}
    />
  );
};

export default SampleForm;
