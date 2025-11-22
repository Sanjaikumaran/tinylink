import React, { useState, useMemo, useRef, useEffect } from "react";
import "./CustomTable.css";

type Column = { key: string; label: string };

interface CustomTableProps {
  tableName?: string;
  data: any[] | undefined;
  isLoading?: boolean;
  columns: Column[];
  searchable?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  columnSelectable?: boolean;
  setSearchText?: (text: string) => void;
  onRowClick?: (row: any) => void;
  AddLinkForm?: React.ReactNode | React.ComponentType<any>;
}

function formatColumnHeader(text: string) {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export default function CustomTable(props: CustomTableProps) {
  const {
    tableName,
    data,
    columns,
    isLoading,
    searchable = true,
    defaultPageSize = 10,
    pageSizeOptions = [5, 10, 25, 50],
    columnSelectable = true,
    setSearchText,
    onRowClick,
    AddLinkForm,
  } = props;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [search, setSearch] = useState("");
  const [columnsSelected, setColumnsSelected] = useState<Column[]>(columns);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [isAddLinkFormOpen, setIsAddLinkFormOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setColumnsSelected(columns);
  }, [columns]);

  const filtered = useMemo(() => {
    const filteredData = data?.filter((row) => {
      const t1 = String(row.code ?? "").toLowerCase();
      const t2 = String(row.target_url ?? "").toLowerCase();
      const s = search.toLowerCase();
      return t1.includes(s) || t2.includes(s);
    });

    if (!filteredData?.length) setSearchText && setSearchText(search);
    return filteredData;
  }, [search, data]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return filtered
      ? [...filtered].sort((a, b) => {
          const valA = a[sortCol];
          const valB = b[sortCol];
          if (typeof valA === "number" && typeof valB === "number")
            return sortDir === "asc" ? valA - valB : valB - valA;
          return sortDir === "asc"
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        })
      : [];
  }, [filtered, sortCol, sortDir]);

  const totalPages = sorted && Math.ceil(sorted.length / pageSize);
  const pageData = sorted?.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(column: string) {
    if (sortCol === column) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortCol(column);
      setSortDir("asc");
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setIsAddLinkFormOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalRows = data?.length || 0;
  const selectedValue = pageSize > totalRows ? totalRows : pageSize;

  return (
    <>
      <div className="table-container" data-testid="table-container">
        <div className="table-controls" data-testid="table-controls">
          {tableName && (
            <div className="table-name" data-testid="table-name">
              {tableName}
            </div>
          )}

          <div
            className="table-search-wrapper"
            data-testid="table-search-wrapper"
          >
            {AddLinkForm && (
              <button
                className="add-link-btn"
                data-testid="add-link-btn"
                onClick={() => setIsAddLinkFormOpen(!isAddLinkFormOpen)}
              >
                Add Link
              </button>
            )}
            {columnSelectable && (
              <ColumnSelector
                allColumns={columns}
                selectedColumns={columnsSelected}
                setSelectedColumns={setColumnsSelected}
              />
            )}

            {searchable && (
              <input
                type="text"
                placeholder="Search"
                value={search}
                data-testid="table-search-input"
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="table-search"
              />
            )}
          </div>
        </div>

        <div className="table-scroll-area" data-testid="table-scroll-area">
          {!isLoading ? (
            data?.length && pageData?.length ? (
              <table className="task-table" data-testid="custom-table">
                <thead>
                  <tr>
                    <th
                      key={"S.No"}
                      data-testid="header-sno"
                      onClick={() => toggleSort("S.No")}
                    >
                      S.No
                    </th>
                    {columnsSelected.map((col) => (
                      <th
                        key={col.key}
                        data-testid={`header-${col.key}`}
                        onClick={() => toggleSort(col.key)}
                      >
                        <div className="table-header-inner">
                          {formatColumnHeader(col.label)}
                          {sortCol === col.key && (
                            <span
                              style={{ marginLeft: 6, color: "#1f1f1fff" }}
                              data-testid={`sort-indicator-${col.key}`}
                            >
                              {sortDir === "asc" ? "▴" : "▾"}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {pageData.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      data-testid={`row-${rowIdx}`}
                      onClick={() => onRowClick?.(row)}
                    >
                      <td data-label="S.No" data-testid={`cell-${rowIdx}-sno`}>
                        {rowIdx + 1}
                      </td>
                      {columnsSelected.map((col) => (
                        <td
                          key={col.key}
                          data-label={formatColumnHeader(col.label)}
                          data-testid={`cell-${rowIdx}-${col.key}`}
                        >
                          {row[col.key] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state" data-testid="empty-state">
                No data available
              </div>
            )
          ) : (
            <div className="loading-indicator" data-testid="loading-indicator">
              Loading...
            </div>
          )}
        </div>

        <div className="pagination" data-testid="pagination">
          <div className="page-size-select" data-testid="page-size-select">
            <select
              value={selectedValue}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                setPage(1);
              }}
              data-testid="page-size-dropdown"
            >
              {totalRows !== 0 && !pageSizeOptions.includes(totalRows) && (
                <option value={totalRows}>{totalRows}</option>
              )}
              {pageSizeOptions.map((s) => (
                <option key={s} value={s} disabled={s > totalRows}>
                  {s}
                </option>
              ))}
            </select>
            / {totalRows} rows per page
          </div>

          <div
            className="pagination-controls"
            data-testid="pagination-controls"
          >
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              data-testid="prev-page-btn"
            >
              Prev
            </button>

            <span data-testid="page-info">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              data-testid="next-page-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isAddLinkFormOpen && (
        <div
          className="add-link-form-wrapper"
          data-testid="add-link-form-wrapper"
        >
          <div
            className="add-link-form"
            ref={containerRef}
            data-testid="add-link-form"
          >
            {AddLinkForm &&
              (typeof AddLinkForm === "function" ? (
                <AddLinkForm />
              ) : (
                AddLinkForm
              ))}
          </div>
        </div>
      )}
    </>
  );
}

interface ColumnSelectorProps {
  allColumns: Column[];
  selectedColumns: Column[];
  setSelectedColumns: (cols: Column[]) => void;
}

export const ColumnSelector = ({
  allColumns,
  selectedColumns,
  setSelectedColumns,
}: ColumnSelectorProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (col: Column) => {
    if (selectedColumns.some((c) => c.key === col.key)) {
      setSelectedColumns(selectedColumns.filter((c) => c.key !== col.key));
    } else {
      setSelectedColumns([...selectedColumns, col]);
    }
  };

  return (
    <div
      className="column-select-wrapper"
      ref={containerRef}
      data-testid="column-selector"
    >
      <button
        className="dropdown-btn"
        onClick={() => setOpen(!open)}
        data-testid="column-selector-btn"
      >
        Columns ({selectedColumns.length})
      </button>

      {open && (
        <div className="dropdown-menu" data-testid="column-selector-menu">
          {allColumns.map((col) => (
            <label
              key={col.key}
              className="dropdown-item"
              data-testid={`column-item-${col.key}`}
            >
              <input
                type="checkbox"
                checked={selectedColumns.some((c) => c.key === col.key)}
                onChange={() => toggleColumn(col)}
                data-testid={`column-checkbox-${col.key}`}
              />
              {formatColumnHeader(col.label)}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
