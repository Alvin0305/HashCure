import React, { useState } from "react";
import "./table.css";

const SortableTable = ({ headingKeys, headingLabels, data }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    const sorted = [...data].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA === valB) return 0;
      if (sortConfig.direction === "asc") {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
    return sorted;
  }, [data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  if (
    !Array.isArray(headingKeys) ||
    !Array.isArray(headingLabels) ||
    !Array.isArray(data) ||
    headingKeys.length !== headingLabels.length
  ) {
    return <p>Invalid input to generate table</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="sortable-table">
        <thead>
          <tr>
            <th>#</th>
            {headingLabels.map((label, index) => {
              const key = headingKeys[index];
              const isSorted = sortConfig.key === key;
              const direction = isSorted
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : "";
              return (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  style={{ cursor: "pointer" }}
                >
                  {label} {direction}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, rowIndex) => (
            <tr key={rowIndex}>
              <td>{rowIndex + 1}</td>
              {headingKeys.map((key, colIndex) => (
                <td key={colIndex}>{item[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;
