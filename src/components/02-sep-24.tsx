test("should display default date range value", async () => {
    const defaultValue = { start: new Date(2024, 7, 1), end: new Date(2024, 7, 15) };

    const dateRangePickerConfig = {
      onChangeHandler: jest.fn(),
      value: defaultValue,
    };

    const props = {
      tableConfig: mockTableConfig,
      tableData: mockData,
      hideToolbar: false,
      gridStyle: { height: "500px" },
      dateRangePickerConfig,
    };

    render(<CustomTable {...props} />);
    await screen.findByText("Item 1");

    // Verify that the default date range is displayed
    const startInput = screen.getByLabelText(/start/i);
    const endInput = screen.getByLabelText(/end/i);

    expect(startInput).toHaveValue("8/1/2024");
    expect(endInput).toHaveValue("8/15/2024");
  });

  test("should call onChange handler when date range is selected", async () => {
    const defaultValue = {
      start: new Date(2024, 8, 1), // Note: months are 0-indexed in JS Date
      end: new Date(2024, 9, 15),
    };
    const onChangeHandler = jest.fn();

    const dateRangePickerConfig = {
      onChangeHandler: onChangeHandler,
      value: defaultValue,
    };

    const props = {
      tableConfig: mockTableConfig,
      tableData: mockData,
      hideToolbar: false,
      gridStyle: { height: "500px" },
      dateRangePickerConfig,
    };

    render(<CustomTable {...props} />);
    await screen.findByText("Item 1");

    // Locate the DateRangePicker fieldset
    const dateRangePicker = screen.getByTestId("date-range-picker");

    // Within the DateRangePicker, find the inputs using placeholders or labels
    const startInput = within(dateRangePicker).getByLabelText(/start/i); // Adjust based on your input placeholders
    const endInput = within(dateRangePicker).getByLabelText(/end/i); // Adjust based on your input placeholders

    // Simulate a user clicking on the start date input to open the calendar
    fireEvent.click(startInput);

    // Now, locate the calendar popup that Kendo renders separately (outside the normal DOM flow)
    const calendar = document.querySelector(".k-calendar"); // Ensure this selector matches the actual calendar class or ID
    expect(calendar).toBeInTheDocument(); // Ensure the calendar is displayed

    // Simulate selecting a start date in the calendar
    const startDateButton = within(calendar).getAllByText("15");
    fireEvent.click(startDateButton[0]);

    // Similarly, locate the end date input field and open the calendar again
    const endDateButton = within(calendar).getAllByText("19");
    fireEvent.click(endDateButton[0]);

    // Adjust expected dates to UTC
    const expectedStartDate = new Date(2024, 8, 15);
    const expectedEndDate = new Date(2024, 8, 19);

    // Verify that onChangeHandler is called with the correct values
    await waitFor(() => expect(onChangeHandler).toHaveBeenCalledTimes(1));
    expect(onChangeHandler).toHaveBeenCalledWith({
      start: expectedStartDate,
      end: expectedEndDate,
    });
  });
