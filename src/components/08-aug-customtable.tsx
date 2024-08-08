import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import CustomTable from "../index";

const tableData = [
  { id: 1, name: "John", age: 25 },
  { id: 2, name: "Jane", age: 30 },
  { id: 3, name: "Bob", age: 35 },
];

const headerConfig = [
  { field: "name", title: "Name" },
  { field: "age", title: "Age" },
];

const tableConfig = { dataItemKey: "id", isItemSelected: false, headerConfig };

describe("CustomTable", () => {
  it("onColumnsSubmit updates the state columns and sets columns expanded to false", () => {
    const columnsState = [
      { field: "name", title: "Name" },
      { field: "age", title: "Age" },
    ];

    const { rerender } = render(<CustomTable tableData={tableData} tableConfig={tableConfig} />);

    const onColumnsSubmit = jest.fn();
    rerender(
      <CustomTable
        tableData={tableData}
        tableConfig={tableConfig}
        onColumnsSubmit={onColumnsSubmit}
      />
    );

    onColumnsSubmit(columnsState);

    expect(onColumnsSubmit).toHaveBeenCalledTimes(1);
    expect(onColumnsSubmit).toHaveBeenCalledWith(columnsState);
  });

  it("onColumnsSubmit updates the state columns and sets columns expanded to false", () => {
    const columnsState = [
      { field: "name", title: "Name" },
      { field: "age", title: "Age" },
    ];

    const setStateColumns = jest.fn();
    const setColumnsExpanded = jest.fn();

    const { rerender } = render(
      <CustomTable
        tableData={tableData}
        tableConfig={tableConfig}
        setStateColumns={setStateColumns}
        setColumnsExpanded={setColumnsExpanded}
      />
    );

    const onColumnsSubmit = (columnsState) => {
      setStateColumns(columnsState);
      setColumnsExpanded(false);
    };

    onColumnsSubmit(columnsState);

    expect(setStateColumns).toHaveBeenCalledTimes(1);
    expect(setStateColumns).toHaveBeenCalledWith(columnsState);
    expect(setColumnsExpanded).toHaveBeenCalledTimes(1);
    expect(setColumnsExpanded).toHaveBeenCalledWith(false);
  });
});
