import { filterBy } from "@progress/kendo-react-data-tools";
import { mapTree, extendDataItem } from "@progress/kendo-react-common";

export const processTreeData = (data: Array<object>, state: {expanded: Array<number>, value: any, filter: any}, fields: {selectField: string, expandField: string, dataItemKey: string, subItemsField: string}) => {
  const { selectField, expandField, dataItemKey, subItemsField } = fields;
  const { expanded, value, filter } = state;
  const filtering: Boolean = Boolean(filter && filter.value);

  return mapTree(
    filtering ? filterBy(data, [filter], subItemsField) : data,
    subItemsField,
    item => {
      const props = {
        [expandField]: expanded.includes(item[dataItemKey]),
        [selectField]: value && item[dataItemKey] === value[dataItemKey]
      };
      return filtering
        ? extendDataItem(item, subItemsField, props)
        : { ...item, ...props };
    }
  );
};

export const expandedState = (item: any, dataItemKey: string, expanded: any[]): any[] => {
    const nextExpanded: string[] = expanded.slice();
    const itemKey: string = item[dataItemKey];
    const index: number = expanded.indexOf(itemKey);
    index === -1 ? nextExpanded.push(itemKey) : nextExpanded.splice(index, 1);
    return nextExpanded;
  };