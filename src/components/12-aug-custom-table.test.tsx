it("calls onSelectionChange with correct data", async () => {
    const props = {
      hideToolbar: true,
      gridStyle: { height: "500px" },
      tableConfig: mockTableConfig,
      tableData: [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ],
    };

    render(<CustomTable {...props} />);
    await screen.findByText("John");
    expect(screen.getByText("John")).toBeInTheDocument();
    const cellInfo = screen.getByText("John");
    const cellRowInfo = cellInfo.parentNode;
    const checkbox = cellRowInfo.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("toggles selection correctly", () => {
    const props = {
      hideToolbar: true,
      gridStyle: { height: "500px" },
      tableConfig: mockTableConfig,
      tableData: [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ],
    };
    render(<CustomTable {...props} />);

    const cellInfo = screen.getByText("John");
    const cellRowInfo = cellInfo.parentNode;
    const checkbox = cellRowInfo.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox);
    expect(cellRowInfo).toHaveClass("k-selected");
    fireEvent.click(checkbox);
    expect(cellRowInfo).not.toHaveClass("k-selected");
  });

  it("calls dataStateChange with correct data for sorting", async () => {
    const props = {
      hideToolbar: true,
      gridStyle: { height: "500px" },
      tableConfig: mockTableConfig,
      tableData: [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
        { id: 3, name: "Bob" },
      ],
    };

    render(<CustomTable {...props} />);
    await screen.findByText("Customer Name", {
      selector: "span.k-column-title",
    });
    await screen.findByText("John");

    const initialJohnPosition = screen.getByText("John").closest("tr");
    expect(initialJohnPosition).toBeInTheDocument();
    expect(initialJohnPosition.rowIndex).toBe(0);

    const HeaderInfo = screen.getByText("Customer Name", {
      selector: "span.k-column-title",
    });
    const HeaderInfoParent = HeaderInfo.parentNode;

    fireEvent.click(HeaderInfoParent);

    const sortedJohnPosition = screen.getByText("John").closest("tr");
    expect(sortedJohnPosition.rowIndex).not.toBe(0);
  });
