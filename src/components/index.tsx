import * as React from "react";
import FilterForm from "./test";

export interface IPocProps {}

export default function Poc(props: IPocProps) {
  const operators = ["LIKE", "NOT LIKE"];
  const responseSchema = { field1: "date", field2: "text", field3: "text", field4: "text" };
  const columnsArray = Object.keys(responseSchema);
  return (
    <div>
      Root Component
      <FilterForm columns={columnsArray} operators={operators} />
    </div>
  );
}
