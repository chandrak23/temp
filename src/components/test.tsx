// @ts-nocheck
import React, { useState } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { TextBox } from "@progress/kendo-react-inputs";

import { FilterDescriptor } from "@progress/kendo-data-query";

interface FilterFormProps {
  columns: string[];
  operators: string[];
  applyFilter: Function;
}

const FilterForm: React.FC<FilterFormProps> = ({ columns, operators, applyFilter }) => {
  const [filters, setFilters] = useState<FilterDescriptor[]>([
    { field: "select", operator: "select", value: "" },
  ]);

  const addFilter = () => {
    setFilters([...filters, { field: "select", operator: "select", value: "" }]);
  };

  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const handleFilterChange = (index: number, key: string, value: any) => {
    const newFilters = [...filters];
    newFilters[index][key] = value;
    setFilters(newFilters);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyFilter(filters);
    // console.log(filters);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {filters.map((filter, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <DropDownList
            style={{ marginRight: "20px" }}
            data={columns}
            value={filter.field}
            defaultItem={"Please select ..."}
            onChange={(event) => handleFilterChange(index, "field", event.target.value)}
          />
          <DropDownList
            style={{ marginRight: "20px" }}
            data={operators}
            value={filter.operator}
            onChange={(event) => handleFilterChange(index, "operator", event.target.value)}
          />
          <TextBox
            value={filter.value}
            onChange={(event) => handleFilterChange(index, "value", event.target.value)}
          />
          <Button onClick={() => removeFilter(index)}>Delete</Button>
        </div>
      ))}
      <Button type="button" onClick={addFilter}>
        Add Filter
      </Button>
      <Button type="submit">Apply Filter</Button>
    </form>
  );
};

export default FilterForm;
