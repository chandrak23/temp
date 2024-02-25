// @ts-nocheck
import React, { useState } from "react";

interface FilterFormProps {
  columns: string[];
  operators: string[];
}

const FilterForm: React.FC<FilterFormProps> = ({ columns, operators }) => {
  const [filters, setFilters] = useState<{ columnName: string; value: string }[]>([
    { columnName: "", operator: "", value: "" },
  ]);

  const addFilter = () => {
    setFilters([...filters, { columnName: "", operator: "", value: "" }]);
  };

  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const handleFilterChange = (index: number, key: string, value: string) => {
    const newFilters = [...filters];
    newFilters[index][key] = value;
    setFilters(newFilters);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(JSON.stringify(filters));
    console.log(filters);
  };

  return (
    <div>
      Filters
      <form onSubmit={handleFormSubmit}>
        {filters.map((filter, index) => (
          <div key={index}>
            <select
              value={filter.columnName}
              onChange={(event) => handleFilterChange(index, "columnName", event.target.value)}
            >
              {columns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
            <select
              value={filter.operator}
              onChange={(event) => handleFilterChange(index, "operator", event.target.value)}
            >
              {operators.map((operator) => (
                <option key={operator} value={operator}>
                  {operator}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={filter.value}
              onChange={(event) => handleFilterChange(index, "value", event?.target?.value)}
            />
            <button type="button" onClick={() => removeFilter(index)}>
              Delete
            </button>
          </div>
        ))}
        <button type="button" onClick={addFilter}>
          Add Filter
        </button>
        <button type="submit">Apply Filter</button>
      </form>
    </div>
  );
};

export default FilterForm;
