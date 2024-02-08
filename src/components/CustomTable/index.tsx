// @ts-nocheck
import * as React from "react";
import { getter } from "@progress/kendo-react-common";
import { DataResult, process, State } from "@progress/kendo-data-query";
import { Input } from "@progress/kendo-react-inputs";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { Button } from "@progress/kendo-react-buttons";
import { ColumnMenu } from "./custom-cells";
import {
  Grid,
  GridColumn as Column,
  GridToolbar,
  GridHeaderSelectionChangeEvent,
} from "@progress/kendo-react-grid";
import { setGroupIds, setExpandedState } from "@progress/kendo-react-data-tools";

import "./style.css";

const initialDataState: State = {
  take: 10,
  skip: 0,
  group: [],
};

const processWithGroups = (data, dataState: State) => {
  const newDataState = process(data, dataState);

  setGroupIds({ data: newDataState.data, group: dataState.group });

  return newDataState;
};

const CustomTable = (props) => {
  const {
    tableConfig: { dataItemKey, isItemSelected, headerConfig },
    tableData,
  } = props;

  const DATA_ITEM_KEY = dataItemKey || "id";
  const SELECTED_FIELD = "selected";
  const idGetter = getter(DATA_ITEM_KEY);

  const [filterValue, setFilterValue] = React.useState();
  const [filteredData, setFilteredData] = React.useState(tableData);
  const [currentSelectedState, setCurrentSelectedState] = React.useState<{
    [id: string]: boolean | number[];
  }>({});
  const [dataState, setDataState] = React.useState<State>(initialDataState);
  const [dataResult, setDataResult] = React.useState(process(filteredData, dataState));

  const [data, setData] = React.useState(filteredData);

  const onFilterChange = (ev) => {
    let value = ev.value;
    setFilterValue(ev.value);
    let newData = tableData.filter((item) => {
      let match = false;
      for (const property in item) {
        if (item[property].toString().toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >= 0) {
          match = true;
        }

        if (
          item[property].toLocaleDateString &&
          item[property].toLocaleDateString().indexOf(value) >= 0
        ) {
          match = true;
        }
      }
      return match;
    });
    setFilteredData(newData);
    let clearedPagerDataState = { ...dataState, take: 8, skip: 0 };
    let processedData = process(newData, clearedPagerDataState);
    setDataResult(processedData);
    setDataState(clearedPagerDataState);
    setData(newData);
  };

  const [resultState, setResultState] = React.useState<DataResult>(
    processWithGroups(
      tableData.map((item) => ({
        ...item,
        selected: currentSelectedState[idGetter(item)],
      })),
      initialDataState
    )
  );

  const dataStateChange = (event) => {
    setDataResult(process(filteredData, event.dataState));
    setDataState(event.dataState);
  };

  const onExpandChange = React.useCallback(
    (event) => {
      const newData = [...dataResult.data];
      const item = event.dataItem;
      if (item.groupId) {
        const targetGroup = newData.find((d) => d.groupId === item.groupId);
        if (targetGroup) {
          targetGroup.expanded = event.value;
          setDataResult({
            ...dataResult,
            data: newData,
          });
        }
      } else {
        item.expanded = event.value;
        setDataResult({
          ...dataResult,
          data: newData,
        });
      }
    },
    [dataResult]
  );

  const setSelectedValue = (data: any[]) => {
    let newData = data.map((item) => {
      if (item.items) {
        return {
          ...item,
          items: setSelectedValue(item.items),
        };
      } else {
        return {
          ...item,
          selected: currentSelectedState[idGetter(item)],
        };
      }
    });
    return newData;
  };

  const newData = setExpandedState({
    data: setSelectedValue(resultState.data),
    collapsedIds: [],
  });

  const onHeaderSelectionChange = React.useCallback(
    (event: GridHeaderSelectionChangeEvent) => {
      const checkboxElement: any = event.syntheticEvent.target;
      const checked = checkboxElement.checked;

      const newSelectedState = {};
      data.forEach((item) => {
        newSelectedState[idGetter(item)] = checked;
      });

      setCurrentSelectedState(newSelectedState);

      const newData = data.map((item) => ({
        ...item,
        [SELECTED_FIELD]: checked,
      }));

      const newDataResult = processWithGroups(newData, dataState);
      setDataResult(newDataResult);
    },
    [data, dataState]
  );

  const onSelectionChange = (event) => {
    const selectedProductId = event.dataItem.id;

    const newData = data.map((item) => {
      if (item.id === selectedProductId) {
        item.selected = !item.selected;
      }
      return item;
    });

    setCurrentSelectedState((prevState) => ({
      ...prevState,
      [selectedProductId]: !prevState[selectedProductId],
    }));

    const newDataResult = processWithGroups(newData, dataState);
    setDataResult(newDataResult);
  };
  const getNumberOfItems = (data: any[]) => {
    let count = 0;
    data.forEach((item) => {
      if (item.items) {
        count = count + getNumberOfItems(item.items);
      } else {
        count++;
      }
    });
    return count;
  };
  const getNumberOfSelectedItems = (data: any[]) => {
    let count = 0;
    data.forEach((item) => {
      if (item.items) {
        count = count + getNumberOfSelectedItems(item.items);
      } else {
        count = count + (item.selected == true ? 1 : 0);
      }
    });
    return count;
  };
  const checkHeaderSelectionValue = () => {
    let selectedItems = getNumberOfSelectedItems(newData);
    return newData.length > 0 && selectedItems == getNumberOfItems(newData);
  };

  const exportExcel = () => {
    _export.save();
  };

  let _export;

  return (
    <div>
      <ExcelExport
        data={tableData}
        ref={(exporter) => {
          _export = exporter;
        }}
      >
        <Grid
          style={{ height: "500px" }}
          pageable={{ pageSizes: true }}
          data={dataResult}
          sortable={true}
          total={resultState.total}
          onDataStateChange={dataStateChange}
          {...dataState}
          onExpandChange={onExpandChange}
          expandField="expanded"
          dataItemKey={DATA_ITEM_KEY}
          selectedField={SELECTED_FIELD}
          onHeaderSelectionChange={onHeaderSelectionChange}
          onSelectionChange={onSelectionChange}
          groupable={true}
          size={"small"}
        >
          <GridToolbar>
            <Input
              value={filterValue}
              onChange={onFilterChange}
              style={{
                border: "2px solid #ccc",
                boxShadow: "inset 0px 0px 0.5px 0px rgba(0,0,0,0.0.1)",
                width: "170px",
                height: "30px",
                marginRight: "10px",
              }}
              placeholder="Search in all columns..."
            />
            <div className="export-btns-container">
              <Button onClick={exportExcel}>Export to Excel</Button>
              {/* <Button onClick={exportPDF}>Export to PDF</Button> */}
            </div>
          </GridToolbar>
          {isItemSelected && (
            <Column
              filterable={false}
              field={SELECTED_FIELD}
              width={50}
              headerSelectionValue={checkHeaderSelectionValue()}
            />
          )}
          {/* <Column
            field="full_name"
            title="Contact Name"
            columnMenu={ColumnMenu}
            cells={{
              data: PersonCell,
            }}
            width="250px"
          /> */}

          {headerConfig?.map((config) => (
            <Column
              field={config?.field}
              title={config?.title}
              columnMenu={ColumnMenu}
              width={config?.width}
            />
          ))}
        </Grid>
      </ExcelExport>
    </div>
  );
};

export default CustomTable;
