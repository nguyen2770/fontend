import React, { forwardRef } from "react";

const CommonPrintForm = forwardRef(({ title, headerFields, items, itemColumns }, ref) => {
  return (
    <div ref={ref} style={{ padding: 20, fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>{title}</h2>

      <div style={{ marginBottom: 16 }}>
        {headerFields.map(({ label, value }, index) => (
          <p key={index}>
            <strong>{label}:</strong> {value || "---"}
          </p>
        ))}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }} border="1">
        <thead>
          <tr>
            <th>STT</th>
            {itemColumns.map((col, i) => (
              <th key={i}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items?.length > 0 ? (
            items.map((item, idx) => (
              <tr key={idx}>
                <td align="center">{idx + 1}</td>
                {itemColumns.map((col, i) => (
                  <td key={i} align={col.align || "left"}>
                    {col.render ? col.render(item[col.dataIndex], item) : item[col.dataIndex]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={itemColumns.length + 1} align="center">Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: 16, textAlign: "right" }}>
        <strong>Tổng cộng:</strong>{" "}
        {items.reduce((sum, i) => sum + (i.totalAmount || 0), 0).toLocaleString("vi-VN")} VND
      </div>

      <div style={{ marginTop: 40, display: "flex", justifyContent: "space-around" }}>
        <div>Người lập phiếu<br /><i>(Ký, ghi rõ họ tên)</i></div>
        <div>Người duyệt<br /><i>(Ký, ghi rõ họ tên)</i></div>
      </div>
    </div>
  );
});

export default CommonPrintForm;
