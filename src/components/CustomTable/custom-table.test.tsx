// @ts-nocheck
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import CustomTable from "../index";

describe("CustomTable", () => {
  const tableData = [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Doe", email: "jane.doe@example.com" },
  ];

  const tableConfig = {
    dataItemKey: "id",
    isItemSelected: true,
    headerConfig: [
      { field: "name", title: "Name", width: "200px" },
      { field: "email", title: "Email", width: "200px" },
    ],
  };

  it("renders grid with data", () => {
    const { getByText } = render(<CustomTable tableData={tableData} tableConfig={tableConfig} />);
    expect(getByText("John Doe")).toBeInTheDocument();
    expect(getByText("Jane Doe")).toBeInTheDocument();
  });

  it("renders grid with search input", () => {
    const { getByPlaceholderText } = render(
      <CustomTable tableData={tableData} tableConfig={tableConfig} />
    );
    expect(getByPlaceholderText("Search in all columns...")).toBeInTheDocument();
  });

  it("renders grid with export button", () => {
    const { getByText } = render(<CustomTable tableData={tableData} tableConfig={tableConfig} />);
    expect(getByText("Export to Excel")).toBeInTheDocument();
  });

  it("updates filterValue state when search input changes", () => {
    const { getByPlaceholderText } = render(
      <CustomTable tableData={tableData} tableConfig={tableConfig} />
    );
    const searchInput = getByPlaceholderText("Search in all columns...");
    fireEvent.change(searchInput, { target: { value: "John" } });
    expect(getByPlaceholderText("Search in all columns...").value).toBe("John");
  });

  it("updates currentSelectedState when header checkbox is clicked", () => {
    const { getByText } = render(<CustomTable tableData={tableData} tableConfig={tableConfig} />);
    const headerCheckbox = getByText("Select All");
    fireEvent.click(headerCheckbox);
    expect(
      getByText("John Doe").parentElement.querySelector('input[type="checkbox"]').checked
    ).toBe(true);
  });
  //   it("calls onSelectionChange when row is clicked", () => {
  //     const onSelectionChange = jest.fn();
  //     const { getByText } = render(
  //       <CustomTable
  //         tableData={tableData}
  //         tableConfig={tableConfig}
  //         onSelectionChange={onSelectionChange}
  //       />
  //     );
  //     const row = getByText("John Doe");
  //     fireEvent.click(row);
  //     expect(onSelectionChange).toHaveBeenCalledTimes(1);
  //   });

  //   it("calls exportExcel when export button is clicked", () => {
  //     const exportExcel = jest.fn();
  //     const { getByText } = render(
  //       <CustomTable tableData={tableData} tableConfig={tableConfig} exportExcel={exportExcel} />
  //     );
  //     const exportButton = getByText("Export to Excel");
  //     fireEvent.click(exportButton);
  //     expect(exportExcel).toHaveBeenCalledTimes(1);
  //   });

  //   it("renders grid with grouped data", async () => {
  //     const tableData = [
  //       { id: 1, name: "John Doe", email: "john.doe@example.com", group: "Group 1" },
  //       { id: 2, name: "Jane Doe", email: "jane.doe@example.com", group: "Group 1" },
  //       { id: 3, name: "Bob Smith", email: "bob.smith@example.com", group: "Group 2" },
  //     ];
  //     const { getByText, findByText } = render(
  //       <CustomTable tableData={tableData} tableConfig={tableConfig} />
  //     );
  //     await findByText("Group 1");
  //     expect(getByText("Group 1")).toBeInTheDocument();
  //     expect(getByText("Group 2")).toBeInTheDocument();
  //   });
});
