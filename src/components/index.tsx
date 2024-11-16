import * as React from "react";
import FilterForm from "./test";
import CustomTable from "../CustomTable";

export interface IPocProps {}

export default function Poc(props: IPocProps) {
  const operators = ["LIKE", "NOT LIKE", "=", ">", ">=", "<", "<="];
  const sampleResponse = {
    header: {
      responeId: "uuid",
      datasetid: "dataset name",
    },
    data: [
      {
        id: 1,
        name: "john wick",
        uid: "aad63f6f-c6b9-447a-9586-e40a217368b3",
        type: "Type 1",
        description: "sample description",
        connection: "connection/oracle",
        tags: "Tag 1, Tag 2",
        country: "US",
        address: "ABC",
      },
      {
        id: 2,
        name: "john smith",
        uid: "aad63f6f-c6b9-447a-9586-340a217368b3",
        type: "Type 2",
        description: "sample description2",
        connection: "connection/mysql",
        tags: "Tag 3, Tag 4",
      },
    ],
    responseSchema: {
      id: "text",
      name: "text",
      uid: "text",
      type: "text",
      description: "date",
      connection: "text",
      tags: "text",
      country: "text",
      address: "text",
    },
    status: "",
    error_message: "",
  };

  const getTableConfig = (tableData: any) => {
    const keysArr = Object.keys(tableData?.[0]);
    const headerConfig = keysArr.map((key) => {
      return {
        title: key,
        field: key,
        width: "230px",
      };
    });
    return {
      dataItemKey: "id",
      isItemSelected: false,
      headerConfig: headerConfig,
    };
  };

  const applyFilter = (filters: any) => {
    const filterObj = filters?.map((filter: any) => {
      return `${filter?.field} ${filter?.operator} ${filter?.value}`;
    });

    const reqObj = {
      header: {
        requestId: "uuid",
        datasetid: "dataset name",
        insertionTimestamp: new Date().getMilliseconds(),
        datasetSource: "HDFS",
      },
      source_config: "source_config",
      filters: filterObj,
      parameters: { filename: "path_to _file", num_of_records: 1000, "filter _operator": "AND/OR" },
    };
    console.log("reqObj", reqObj);
  };

  const tableData = sampleResponse?.data || [];
  const tableConfig = getTableConfig(tableData);
  const responseSchema = sampleResponse?.responseSchema || {};
  const columnsArray = Object.keys(responseSchema);

  return (
    <div>
      <legend className={"heading"}>List existing Data source</legend>
      <CustomTable tableConfig={tableConfig} tableData={tableData} />
      <legend className={"heading"}>Filters</legend>
      <FilterForm columns={columnsArray} operators={operators} applyFilter={applyFilter} />
    </div>
  );
}
