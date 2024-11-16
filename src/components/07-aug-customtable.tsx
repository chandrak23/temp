import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CustomTable } from './CustomTable';

describe('onColumnsSubmit function', () => {
  it('should update stateColumns state with new columnsState', () => {
    const setStateColumns = jest.fn();
    const setColumnsExpanded = jest.fn();
    const columnsState = [{ field: 'id', title: 'ID' }, { field: 'name', title: 'Name' }];

    const { container } = render(
      <CustomTable
        setStateColumns={setStateColumns}
        setColumnsExpanded={setColumnsExpanded}
        onColumnsSubmit={onColumnsSubmit}
      />
    );

    const submitButton = container.querySelector('button[type="submit"]');

    fireEvent.click(submitButton);

    waitFor(() => {
      expect(setStateColumns).toHaveBeenCalledTimes(1);
      expect(setStateColumns).toHaveBeenCalledWith(columnsState);
    });
  });

  it('should set columnsExpanded state to false', () => {
    const setStateColumns = jest.fn();
    const setColumnsExpanded = jest.fn();
    const columnsState = [{ field: 'id', title: 'ID' }, { field: 'name', title: 'Name' }];

    const { container } = render(
      <CustomTable
        setStateColumns={setStateColumns}
        setColumnsExpanded={setColumnsExpanded}
        onColumnsSubmit={onColumnsSubmit}
      />
    );

    const submitButton = container.querySelector('button[type="submit"]');

    fireEvent.click(submitButton);

    waitFor(() => {
      expect(setColumnsExpanded).toHaveBeenCalledTimes(1);
      expect(setColumnsExpanded).toHaveBeenCalledWith(false);
    });
  });

  it('should update dataResult and dataState with new dataState', () => {
    const setDataResult = jest.fn();
    const setDataState = jest.fn();
    const filteredData = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    const dataState = { take: 10, skip: 0, group: [] };
    const dataResult = { data: filteredData, total: 2 };

    const { container } = render(
      <CustomTable
        setDataResult={setDataResult}
        setDataState={setDataState}
        filteredData={filteredData}
        dataState={dataState}
        dataResult={dataResult}
      />
    );

    const dataStateChange = (event: any) => {
      setDataResult(process(filteredData, event.dataState));
      setDataState(event.dataState);
    };

    const newDataState = { take: 5, skip: 0, group: [] };

    fireEvent.change(container.querySelector('input[name="take"]'), {
      target: { value: newDataState.take },
    });

    fireEvent.change(container.querySelector('input[name="skip"]'), {
      target: { value: newDataState.skip },
    });

    dataStateChange({ dataState: newDataState });

    waitFor(() => {
      expect(setDataResult).toHaveBeenCalledTimes(1);
      expect(setDataResult).toHaveBeenCalledWith(
        expect.objectContaining({ data: filteredData.slice(0, 5) })
      );

      expect(setDataState).toHaveBeenCalledTimes(1);
      expect(setDataState).toHaveBeenCalledWith(newDataState);
    });
  });

  it('should update dataResult with expanded item', () => {
    const setDataResult = jest.fn();
    const setDataState = jest.fn();
    const filteredData = [
      { id: 1, name: 'Item 1', groupId: 'group1' },
      { id: 2, name: 'Item 2', groupId: 'group1' },
      { id: 3, name: 'Item 3', groupId: 'group2' },
    ];
    const dataState = { take: 10, skip: 0, group: [] };
    const dataResult = { data: filteredData, total: 3 };

    const { container } = render(
      <CustomTable
        setDataResult={setDataResult}
        setDataState={setDataState}
        filteredData={filteredData}
        dataState={dataState}
        dataResult={dataResult}
      />
    );

    const onExpandChange = React.useCallback((event: any) => {
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
    }, [dataResult]);

    const expandedData = [
      { id: 1, name: 'Item 1', groupId: 'group1', expanded: true },
      { id: 2, name: 'Item 2', groupId: 'group1', expanded: false },
      { id: 3, name: 'Item 3', groupId: 'group2', expanded: false },
    ];

    onExpandChange({ dataItem: expandedData[0], value: true });

    waitFor(() => {
      expect(setDataResult).toHaveBeenCalledTimes(1);
      expect(setDataResult).toHaveBeenCalledWith(
        expect.objectContaining({ data: expandedData })
      );
    });
  });

  it('should update currentSelectedState and dataResult on selection change', () => {
    const data = [
      { id: 1, name: 'Item 1', selected: false },
      { id: 2, name: 'Item 2', selected: false },
      { id: 3, name: 'Item 3', selected: false, items: [
        { id: 4, name: 'Item 4', selected: false },
        { id: 5, name: 'Item 5', selected: false },
      ] },
    ];
    const dataState = { take: 10, skip: 0, group: [] };
    const setCurrentSelectedState = jest.fn();
    const setDataResult = jest.fn();
    const processWithGroups = jest.fn((data, dataState) => data);

    const { container } = render(
      <CustomTable
        data={data}
        dataState={dataState}
        setCurrentSelectedState={setCurrentSelectedState}
        setDataResult={setDataResult}
        processWithGroups={processWithGroups}
      />
    );

    const onSelectionChange = (event: any) => {
      const selectedProductId = event.dataItem.id;

      const newData = data.map((item: any) => {
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

    fireEvent.click(container.querySelector(`[data-id="1"]`));

    waitFor(() => {
      expect(setCurrentSelectedState).toHaveBeenCalledTimes(1);
      expect(setCurrentSelectedState).toHaveBeenCalledWith({
        1: true,
      });

      expect(setDataResult).toHaveBeenCalledTimes(1);
      expect(setDataResult).toHaveBeenCalledWith([
        { id: 1, name: 'Item 1', selected: true },
        { id: 2, name: 'Item 2', selected: false },
        { id: 3, name: 'Item 3', selected: false, items: [
          { id: 4, name: 'Item 4', selected: false },
          { id: 5, name: 'Item 5', selected: false },
        ] },
      ]);
    });
  });

  it('should return the correct number of items', () => {
    const data = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3', items: [
        { id: 4, name: 'Item 4' },
        { id: 5, name: 'Item 5' },
      ] },
    ];

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

    expect(getNumberOfItems(data)).toBe(5);
  });

  it('should return the correct number of selected items', () => {
    const data = [
      { id: 1, name: 'Item 1', selected: true },
      { id: 2, name: 'Item 2', selected: false },
      { id: 3, name: 'Item 3', selected: false, items: [
        { id: 4, name: 'Item 4', selected: true },
        { id: 5, name: 'Item 5', selected: false },
      ] },
    ];

    const getNumberOfSelectedItems = (data: any[]) => {
      let count = 0;
      data.forEach((item) => {
        if (item.items) {
          count = count + getNumberOfSelectedItems(item.items);
        } else {
          count = count + (item.selected === true ? 1 : 0);
        }
      });
      return count;
    };

    expect(getNumberOfSelectedItems(data)).toBe(2);
  });
});
