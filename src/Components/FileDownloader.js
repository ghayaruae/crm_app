import axios from "axios";
import * as XLSX from "xlsx";
import { DateFormater } from "./GlobalFunctions";

export const downloadExcel = async ({
    apiURL,
    endpoint,
    headers,
    params = {},
    cols = [],
    fileName = "report.xlsx",
    summaryData = [],
    metaData = []
}) => {
    try {
        const response = await axios.get(`${apiURL}${endpoint}`, {
            headers,
            params: {
                ...params,
                page: 1,
                limit: params.limit || 100000
            }
        })

        if (!response.data?.success) return

        const rows = response.data.data || []

        const formatRows = (data) =>
            data.map(row => {
                let obj = {}
                cols.forEach(col => {
                    if (col.key === "created_date" || col.key === "voucher_date") {
                        obj[col.label] = DateFormater(row[col.key])
                    } else {
                        obj[col.label] = row[col.key] ?? ""
                    }
                })
                return obj
            })

        const worksheet = XLSX.utils.aoa_to_sheet([])

        let currentRow = 0

        if (metaData.length) {
            metaData.forEach(item => {
                XLSX.utils.sheet_add_aoa(
                    worksheet,
                    [[item]],
                    { origin: `A${currentRow + 1}` }
                )
                currentRow++
            })
            currentRow++
        }

        XLSX.utils.sheet_add_json(
            worksheet,
            formatRows(rows),
            { origin: `A${currentRow + 1}` }
        )

        currentRow += rows.length + 1

        if (summaryData.length) {
            currentRow++
            XLSX.utils.sheet_add_json(
                worksheet,
                formatRows(summaryData),
                { origin: `A${currentRow + 1}`, skipHeader: true }
            )
        }

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report")

        XLSX.writeFile(workbook, fileName)

    } catch (error) {
        console.error("Excel download error:", error)
    }
}