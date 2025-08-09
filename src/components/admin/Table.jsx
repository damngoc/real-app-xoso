import React from "react";
import { formatDate } from "@/utils/moment";
import { formatCurrency } from "@/utils/helper";

/**
 * props:
 * - columns: [{ key: 'name', label: 'Tên' }, ...]
 * - data: [{ id: 1, name: '...', ... }, ...]
 * - onEdit: (row) => void
 * - onDelete: (row) => void
 * - actionsLabel: string (optional)
 */
const Table = ({
  columns,
  data,
  onEdit,
  onDelete,
  onConfirm,
  onReject,
  actionsLabel,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                {col.label}
              </th>
            ))}
            {actionsLabel && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {actionsLabel}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-4 text-center text-gray-500"
              >
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                    {col.key === "idColumn" ? (
                      row[col.key] || rowIndex + 1
                    ) : col.key === "image" || col.key === "content" ? (
                      row[col.key] && (
                        <img
                          src={row[col.key]}
                          alt="promotion"
                          className="max-h-12 rounded shadow border"
                          style={{ maxWidth: 120, objectFit: "contain" }}
                        />
                      )
                    ) : col.key === "date" || col.key === "createdAt" ? (
                      <>
                        <span className="text-gray-900 text-md">
                          {formatDate(row[col.key], "DD/MM/YYYY")}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          {formatDate(row[col.key], "HH:mm:ss")}
                        </span>
                      </>
                    ) : col.key === "amount" || col.key === "betAmount" ? (
                      <>
                        <span className="text-gray-900 text-sm">
                          {formatCurrency(row[col.key])}
                        </span>
                      </>
                    ) : col.key === "type" ? (
                      row[col.key] === "deposit" ? (
                        <span className="text-green-500">Nạp tiền</span>
                      ) : (
                        <span className="text-red-500">Rút tiền</span>
                      )
                    ) : col.key === "status" ? (
                      row[col.key] === "pending" ? (
                        <span className="text-yellow-500">Đang chờ</span>
                      ) : row[col.key] === "approved" ? (
                        <span className="text-green-500">Thành công</span>
                      ) : (
                        <span className="text-red-500">Thất bại</span>
                      )
                    ) : col.key === "adminNote" ? (
                      <span className="text-gray-700">
                        {row[col.key] || ""}
                      </span>
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
                {actionsLabel && (
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <>
                      {onConfirm && (
                        <button
                          key="accept"
                          onClick={() => onConfirm(row)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                        >
                          Chấp nhận
                        </button>
                      )}
                      {onReject && (
                        <button
                          key="reject"
                          onClick={() => onReject(row)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                        >
                          Từ chối
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                        >
                          Sửa
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        >
                          Xóa
                        </button>
                      )}
                    </>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
