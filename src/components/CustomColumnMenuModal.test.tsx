import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CustomColumnMenuModal } from './CustomColumnMenuModal';

describe('CustomColumnMenuModal', () => {
  it('renders GridLayout with columns', () => {
    const props = {
      columns: [
        { title: 'Column 1', show: true },
        { title: 'Column 2', show: false },
        { title: 'Column 3', show: true },
      ],
      columnsExpanded: true,
      onColumnsSubmit: jest.fn(),
    };
    const { getByText } = render(<CustomColumnMenuModal {...props} />);
    expect(getByText('Column 1')).toBeInTheDocument();
    expect(getByText('Column 2')).toBeInTheDocument();
    expect(getByText('Column 3')).toBeInTheDocument();
  });

  it('renders Switch for each column', () => {
    const props = {
      columns: [
        { title: 'Column 1', show: true },
        { title: 'Column 2', show: false },
        { title: 'Column 3', show: true },
      ],
      columnsExpanded: true,
      onColumnsSubmit: jest.fn(),
    };
    const { getAllByRole } = render(<CustomColumnMenuModal {...props} />);
    const switches = getAllByRole('switch');
    expect(switches.length).toBe(3);
  });

  it('calls onToggleColumn when Switch is clicked', () => {
    const props = {
      columns: [
        { title: 'Column 1', show: true },
        { title: 'Column 2', show: false },
        { title: 'Column 3', show: true },
      ],
      columnsExpanded: true,
      onColumnsSubmit: jest.fn(),
    };
    const { getAllByRole } = render(<CustomColumnMenuModal {...props} />);
    const switches = getAllByRole('switch');
    fireEvent.click(switches[0]);
    expect(props.columns[0].show).toBe(false);
  });

  it('renders Button for Reset and Save', () => {
    const props = {
      columns: [
        { title: 'Column 1', show: true },
        { title: 'Column 2', show: false },
        { title: 'Column 3', show: true },
      ],
      columnsExpanded: true,
      onColumnsSubmit: jest.fn(),
    };
    const { getByText } = render(<CustomColumnMenuModal {...props} />);
    expect(getByText('Reset')).toBeInTheDocument();
    expect(getByText('Save')).toBeInTheDocument();
  });

  it('calls onReset when Reset button is clicked', () => {
    const props = {
      columns: [
        { title: 'Column 1', show: true },
        { title: 'Column 2', show: false },
        { title: 'Column 3', show: true },
      ],
      columnsExpanded: true,
      onColumnsSubmit: jest.fn(),
    };
    const { getByText } = render(<CustomColumnMenuModal {...props} />);
    const resetButton = getByText('Reset');
    fireEvent.click(resetButton);
    expect(props.onColumnsSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when Save button is clicked', () => {
    const props = {
      columns: [
        { title: 'Column 1', show: true },
        { title: 'Column 2', show: false },
        { title: 'Column 3', show: true },
      ],
      columnsExpanded: true,
      onColumnsSubmit: jest.fn(),
    };
    const { getByText } = render(<CustomColumnMenuModal {...props} />);
    const saveButton = getByText('Save');
    fireEvent.click(saveButton);
    expect(props.onColumnsSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders modal only when columnsExpanded is true', () => {
    const props = {
      columns: [
        { title: 'Column 1', show: true },
        { title: 'Column 2', show: false },
        { title: 'Column 3', show: true },
      ],
      columnsExpanded: false,
      onColumnsSubmit: jest.fn(),
    };
    const { queryByText } = render(<CustomColumnMenuModal {...props} />);
    expect(queryByText('Column 1')).not.toBeInTheDocument();
  });
});
