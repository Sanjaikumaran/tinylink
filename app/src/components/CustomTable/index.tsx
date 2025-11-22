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
      <div className="table-container">
        <div className="table-controls">
          {tableName && <div className="table-name">{tableName}</div>}

          <div className="table-search-wrapper">
            {AddLinkForm && (
              <button
                className="add-link-btn"
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
              <>
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="table-search"
                />
              </>
            )}
          </div>
        </div>

        <div className="table-scroll-area">
          {!isLoading ? (
            data?.length && pageData?.length ? (
              <table className="task-table">
                <thead>
                  <tr>
                    <th key={"S.No"} onClick={() => toggleSort("S.No")}>
                      S.No
                    </th>
                    {columnsSelected.map((col) => (
                      <th key={col.key} onClick={() => toggleSort(col.key)}>
                        <div className="table-header-inner">
                          {formatColumnHeader(col.label)}
                          {sortCol === col.key && (
                            <span style={{ marginLeft: 6, color: "#1f1f1fff" }}>
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
                    <tr key={rowIdx} onClick={() => onRowClick?.(row)}>
                      <td data-label="S.No">{rowIdx + 1}</td>
                      {columnsSelected.map((col) => (
                        <td key={col.key}>{row[col.key] ?? "-"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">No data available</div>
            )
          ) : (
            <div className="loading-indicator">Loading...</div>
          )}
        </div>

        <div className="pagination">
          <div className="page-size-select">
            <select
              value={selectedValue}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                setPage(1);
              }}
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

          <div className="pagination-controls">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isAddLinkFormOpen && (
        <div className="add-link-form-wrapper">
          <div className="add-link-form" ref={containerRef}>
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
    <div className="column-select-wrapper" ref={containerRef}>
      <button className="dropdown-btn" onClick={() => setOpen(!open)}>
        Columns ({selectedColumns.length})
      </button>

      {open && (
        <div className="dropdown-menu">
          {allColumns.map((col) => (
            <label key={col.key} className="dropdown-item">
              <input
                type="checkbox"
                checked={selectedColumns.some((c) => c.key === col.key)}
                onChange={() => toggleColumn(col)}
              />
              {formatColumnHeader(col.label)}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
