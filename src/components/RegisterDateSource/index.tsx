import * as React from "react";
import { Form, Field, FormElement, FormRenderProps } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import "./style.scss";

import { FormInput, FormTextArea, FormDropDownList } from "../Form/form-components";

import { nameValidator } from "../Form/validators";
import CustomTable from "../CustomTable";

const RegisterDateSource = () => {
  const handleSubmit = (dataItem: { [name: string]: any }) =>
    alert(JSON.stringify(dataItem, null, 2));
  return (
    <>
      <div className="register-data-source-list">
        <legend className={"heading"}>List existing Data source</legend>
        <CustomTable />
      </div>
      <Form
        onSubmit={handleSubmit}
        render={(formRenderProps: FormRenderProps) => (
          <FormElement>
            <fieldset className={"k-form-fieldset register-data-source-form"}>
              <legend className={"k-form-legend heading"}>Register Data Source</legend>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Field
                  className={"form-x"}
                  id={"name"}
                  name={"name"}
                  label={"Name"}
                  placeholder={"Enter Name"}
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
                  type={"password"}
                  component={FormInput}
                  // validator={nameValidator}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Field
                  id={"description"}
                  name={"description"}
                  label={"Description"}
                  component={FormTextArea}
                  placeholder={"Description"}
                  // validator={nameValidator}
                />
                <Field
                  id={"connection"}
                  name={"connection"}
                  label={"Connection"}
                  component={FormInput}
                  placeholder={"oracleDBName/connection String"}
                  // validator={nameValidator}
                />
              </div>

              <Field
                id={"tags"}
                name={"tags"}
                label={"Tags"}
                component={FormInput}
                placeholder={"Tags"}
                // validator={nameValidator}
              />

              <span className={"k-form-separator"} />
              {/* <Field
              id={"terms"}
              name={"terms"}
              label={"I agree with terms and conditions"}
              component={FormCheckbox}
              validator={termsValidator}
            /> */}
              <div className="k-form-buttons">
                <Button
                  themeColor={"primary"}
                  type={"submit"}
                  className="primary-btn"
                  rounded="small"
                  size="medium"
                  disabled={!formRenderProps.allowSubmit}
                >
                  Submit
                </Button>
                <Button
                  themeColor={"primary"}
                  className="primary-btn"
                  rounded="small"
                  size="medium"
                  onClick={formRenderProps.onFormReset}
                >
                  Cancel
                </Button>
              </div>
            </fieldset>
          </FormElement>
        )}
      />
    </>
  );
};

export default RegisterDateSource;
