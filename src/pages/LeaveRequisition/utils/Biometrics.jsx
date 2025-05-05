import axios from "axios";
import moment from "moment-timezone";
import * as XLSX from "xlsx";

export async function Essl(
  data,
  file,
  organisationId,
  authToken,
  setLoading,
  setSuccess
) {
  if (!file) {
    console.error("No file uploaded!");
    return;
  }

  const reader = new FileReader();

  setLoading(true);

  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      try {
        const fileData = new Uint8Array(e.target.result);

        // Parse the workbook
        const workbook = XLSX.read(fileData, {
          type: "array",
          cellDates: true,
          raw: false,
        });

        // Get the first sheet
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Find the days row (contains "Days" text)
        const daysRowIndex = jsonData.findIndex(
          (row) => row && row.some((cell) => cell === "Days")
        );

        if (daysRowIndex === -1) {
          throw new Error("Could not find days row in the Excel file");
        }

        // Extract date range from the data
        const dateRangeString = jsonData[2][1];
        const [startDateString] = dateRangeString
          .replace("To", "")
          .split("  ")
          .map((date) => date.trim());

        const startDate = moment.tz(startDateString, "Asia/Kolkata");
        // console.log(`🚀 ~ startDate:`, startDate);
        // const endDate = moment.tz(endDateString, "Asia/Kolkata");

        let dateArray = [];

        // Process the days row to create actual dates
        const daysRow = jsonData[daysRowIndex];
        console.log(daysRow);

        let currentDate = moment.tz(startDate, "Asia/Kolkata");
        for (let i = 1; i < daysRow.length; i++) {
          const day = parseInt(daysRow[i], 10);
          console.log(`🚀 ~ day:`, day);
          if (!isNaN(day)) {
            if (day < currentDate.date()) {
              currentDate.add(1, "month");
            }
            currentDate.date(day);

            const dateString = currentDate.format("YYYY-MM-DD");
            dateArray.push(dateString);
          } else {
            dateArray.push(undefined);
          }
        }

        const employees = [];
        let currentEmployee = null;

        // Process rows after the days row
        for (let i = daysRowIndex; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          if (row[0] === "Emp. Code:") {
            currentEmployee = {
              empCode: row[3]?.toString() || "",
              empName: row[13]?.toString() || "",
              attendance: [],
            };
            employees.push(currentEmployee);
            continue;
          }

          if (currentEmployee) {
            if (row[0] === "Status") {
              for (let j = 1; j < row.length; j++) {
                if (dateArray[j - 1] !== undefined) {
                  currentEmployee.attendance[j - 1] = {
                    date: dateArray[j - 1],
                    Status: row[j] || undefined,
                    InTime: undefined,
                    OutTime: undefined,
                  };
                }
              }
            } else if (row[0] === "InTime") {
              for (let j = 1; j < row.length; j++) {
                if (
                  currentEmployee.attendance[j - 1] &&
                  dateArray[j - 1] !== undefined
                ) {
                  currentEmployee.attendance[j - 1].InTime =
                    row[j] || undefined;
                }
              }
            } else if (row[0] === "OutTime") {
              for (let j = 1; j < row.length; j++) {
                if (
                  currentEmployee.attendance[j - 1] &&
                  dateArray[j - 1] !== undefined
                ) {
                  currentEmployee.attendance[j - 1].OutTime =
                    row[j] || undefined;
                }
              }
            }
          }
        }

        resolve(employees);
        const chunkSize = 300;
        const chunks = [];

        for (let i = 0; i < employees.length; i += chunkSize) {
          const chunk = employees.slice(i, i + chunkSize);
          chunks.push(chunk);
        }

        try {
          for (let index = 0; index < chunks.length; index++) {
            const chunk = chunks[index];

            const apiEndpoint = `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-essl-data`;
            const headers = {
              "Content-Type": "application/json",
              Authorization: authToken,
            };

            await axios.post(
              apiEndpoint,
              { chunk, hours: data?.hours },
              { headers }
            );
          }
          setSuccess(true);
        } catch (error) {
          console.error(`Error sending chunk to the backend:`, error);
        } finally {
          setLoading(false);
        }
        // return employees;
      } catch (error) {
        reject(error);
        setLoading(false);
      }
    };

    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      reject(error);
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  });
}

export async function zktecho(
  data,
  file,
  organisationId,
  authToken,
  setLoading,
  setSuccess
) {
  // if (tabIndex === 0 && !file) {
  //   // Handle case where no file is uploaded
  //   return;
  // }
  if (!file) {
    //   // Handle case where no file is uploaded
    return;
  }

  const { start, end, hours } = data;
  const startDate = new Date(start.startDate);
  const endDate = new Date(end.startDate);
  endDate.setDate(endDate.getDate() + 1); // Add one day to endDate

  setLoading(true);

  const reader = new FileReader();
  reader.onload = async (e) => {
    const fileData = new Uint8Array(e.target.result);
    const workbook = XLSX.read(fileData, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    let jsonData = XLSX.utils.sheet_to_json(worksheet);
    jsonData = jsonData.slice(1);
    const chunkSize = 300;
    const chunks = [];

    for (let i = 0; i < jsonData.length; i += chunkSize) {
      const chunk = jsonData.slice(i, i + chunkSize);

      const transformedChunk = chunk
        .filter((item) => {
          const itemDate = new Date(item["__EMPTY_2"]);
          return itemDate >= startDate && itemDate <= endDate;
        })
        .map((item) => ({
          "Employee ID": item["Transaction"],
          "First Name": item["__EMPTY"],
          Department: item["__EMPTY_1"],
          Date: item["__EMPTY_2"],
          "Punch Time": item["__EMPTY_3"],
          "Punch State": item["__EMPTY_4"],
        }));

      chunks.push(transformedChunk);
    }

    console.log(`🚀 ~ chunks:`, chunks);

    try {
      for (let index = 0; index < chunks.length; index++) {
        const chunk = chunks[index];

        const apiEndpoint = `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-punching-data`;
        const headers = {
          "Content-Type": "application/json",
          Authorization: authToken,
        };

        await axios.post(
          apiEndpoint,
          { start, end, hours, chunk },
          { headers }
        );
      }
      setSuccess(true);
    } catch (error) {
      console.error(`Error sending chunk to the backend:`, error);
    } finally {
      setLoading(false);
    }
  };
  reader.readAsArrayBuffer(file);
}
