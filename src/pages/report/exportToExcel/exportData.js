import { utils, write } from "xlsx";
import FileSaver from "file-saver";
import ShowError from "../../../components/modal/result/errorNotification";

/*
* @param {Array} data - mảng dữ liệu truyenf vào
* @param {Array} columns - cột
* @param {String} fileName
*/
export const exportToExcel = (data, columns, fileName = "BaoCao.xlsx", t) => {
    if (!Array.isArray(data) || !columns || columns.length === 0) {
        ShowError('topRight', t("common.notifications"), t("Dữ liệu hoặc cấu hình cột không hợp lệ!"));
        return;
    }
    const rows = data.map((item, index) => {
        const row = {};
        columns.forEach(col => {
            if (col.key === "stt") {
                row[col.header] = index + 1;
            } else {
                const value = col.key.split('.').reduce((obj, key) => obj?.[key], item);
                row[col.header] = (value !== null && value !== undefined) ? value : "";
            }
        });
        return row;
    });

    const ws = utils.json_to_sheet(rows);
    ws["!cols"] = columns.map((_, index) => ({
        wpx: index === 0 ? 50 : 150
    }));
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "BaoCao");

    const wbout = write(wb, { bookType: "xlsx", type: "array" });

    FileSaver.saveAs(
        new Blob([wbout], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }),
        fileName
    );
};

export const transformColumnsForExcel = (antdColums) => {
    const flattened = [];
    const flatten = (cols => {
        cols.forEach(col => {
            if (col.key === "action" || col.dataIndex === "action" || col.key === "id") {
                return;
            }
            if (col.children && Array.isArray(col.children)) {
                flatten(col.children);
            } else {
                flattened.push({
                    header: col.title,
                    key: col.excelKey || (Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : col.dataIndex) || col.key,
                });
            }
        })
    })
    flatten(antdColums);
    return flattened;
    // antdColums.filter(col =>
    //     col.key !== "action" && col.dataIndex !== "action"
    //     && col.key !== "id" && col.dataIndex !== "id"
    // )
    //     .map(col => ({
    //         header: col.title,
    //         key: col.excelKey || col.dataIndex || col.key,
    //     }));
}