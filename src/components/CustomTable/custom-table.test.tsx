import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomTable from './CustomTable'; // Adjust the import path as necessary
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Grid, GridToolbar, Column } from '@progress/kendo-react-grid';
import '@testing-library/jest-dom/extend-expect';

const mockData = [
  { id: 1, name: 'Item 1', selected: false },
  { id: 2, name: 'Item 2', selected: false },
];

const mockTableConfig = {
  dataItemKey: 'id',
  isItemSelected: true,
  headerConfig: [
    { field: 'name', title: 'Name', show: true, width: 150 },
  ],
};

const mockReportContextDropdown = {
  enabled: true,
  data: ['Option 1', 'Option 2'],
  selected: 'Option 1',
  onChange: jest.fn(),
};

const mockProps = {
  tableConfig: mockTableConfig,
  tableData: mockData,
  hideToolbar: false,
  refreshHandler: jest.fn(),
  gridStyle: { height: '500px' },
  reportContextDropdown: mockReportContextDropdown,
  enableFul1Screen: true,
  toggleFullScreen: jest.fn(),
};

describe('CustomTable Component', () => {
  test('renders CustomTable with given data', () => {
    render(<CustomTable {...mockProps} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  test('renders toolbar with refresh and fullscreen buttons', () => {
    render(<CustomTable {...mockProps} />);

    const refreshButton = screen.getByTitle('refresh');
    const fullscreenButton = screen.getByText('View in Full Screen');

    expect(refreshButton).toBeInTheDocument();
    expect(fullscreenButton).toBeInTheDocument();
  });

  test('calls refreshHandler on refresh button click', () => {
    render(<CustomTable {...mockProps} />);

    const refreshButton = screen.getByTitle('refresh');
    fireEvent.click(refreshButton);

    expect(mockProps.refreshHandler).toHaveBeenCalled();
  });

  test('calls toggleFullScreen on fullscreen button click', () => {
    render(<CustomTable {...mockProps} />);

    const fullscreenButton = screen.getByText('View in Full Screen');
    fireEvent.click(fullscreenButton);

    expect(mockProps.toggleFullScreen).toHaveBeenCalled();
  });

  test('renders dropdown in toolbar and handles selection change', () => {
    render(<CustomTable {...mockProps} />);

    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();

    fireEvent.change(dropdown, { target: { value: 'Option 2' } });
    expect(mockProps.reportContextDropdown.onChange).toHaveBeenCalled();
  });

  test('selects and deselects a row on click', () => {
    render(<CustomTable {...mockProps} />);

    const firstRowCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(firstRowCheckbox);

    expect(firstRowCheckbox.checked).toBe(true);

    fireEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox.checked).toBe(false);
  });

  test('selects and deselects all rows using header checkbox', () => {
    render(<CustomTable {...mockProps} />);

    const headerCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(headerCheckbox);

    const rowCheckboxes = screen.getAllByRole('checkbox').slice(1);
    rowCheckboxes.forEach((checkbox) => {
      expect(checkbox.checked).toBe(true);
    });

    fireEvent.click(headerCheckbox);
    rowCheckboxes.forEach((checkbox) => {
      expect(checkbox.checked).toBe(false);
    });
  });
});
