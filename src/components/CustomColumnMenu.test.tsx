import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CustomColumnMenu } from './CustomColumnMenu';

describe('CustomColumnMenu', () => {
  it('renders GridColumnMenuSort', () => {
    const props = {
      columns: [],
      onColumnsSubmit: jest.fn(),
      setColumnsExpanded: jest.fn(),
      columnsExpanded: false,
    };
    const { getByText } = render(<CustomColumnMenu {...props} />);
    expect(getByText('Sort')).toBeInTheDocument();
  });

  it('renders GridColumnMenuFilter', () => {
    const props = {
      columns: [],
      onColumnsSubmit: jest.fn(),
      setColumnsExpanded: jest.fn(),
      columnsExpanded: false,
    };
    const { getByText } = render(<CustomColumnMenu {...props} />);
    expect(getByText('Filter')).toBeInTheDocument();
  });

  it('renders GridColumnMenuGroup', () => {
    const props = {
      columns: [],
      onColumnsSubmit: jest.fn(),
      setColumnsExpanded: jest.fn(),
      columnsExpanded: false,
    };
    const { getByText } = render(<CustomColumnMenu {...props} />);
    expect(getByText('Group')).toBeInTheDocument();
  });

  it('renders GridColumnMenuItemGroup', () => {
    const props = {
      columns: [],
      onColumnsSubmit: jest.fn(),
      setColumnsExpanded: jest.fn(),
      columnsExpanded: false,
    };
    const { getByText } = render(<CustomColumnMenu {...props} />);
    expect(getByText('Columns')).toBeInTheDocument();
  });

  it('calls setColumnsExpanded on GridColumnMenuItem click', () => {
    const props = {
      columns: [],
      onColumnsSubmit: jest.fn(),
      setColumnsExpanded: jest.fn(),
      columnsExpanded: false,
    };
    const { getByText } = render(<CustomColumnMenu {...props} />);
    const menuItem = getByText('Columns');
    fireEvent.click(menuItem);
    expect(props.setColumnsExpanded).toHaveBeenCalledTimes(1);
  });
});
