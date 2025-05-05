import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import ReusableModal from "../../../components/Modal/component";
import * as XLSX from "xlsx"; // Import xlsx library

const localizer = momentLocalizer(moment);

const StudentAttendanceCalendar = ({ studentData, punches, onClose }) => {
  const [selectedPunch, setSelectedPunch] = useState(null);
  const [selectedDatePunches, setSelectedDatePunches] = useState([]);
  const [loading] = useState(false);
  const [activeMonth, setActiveMonth] = useState(new Date());

  // Group punches into pairs (in and out)
  const groupedPunches = punches.reduce((acc, punch, index) => {
    if (index % 2 === 0) {
      acc.push({
        title: `Punch ${Math.floor(index / 2) + 1}`,
        start: new Date(punch.timestamp),
        end: new Date(punches[index + 1]?.timestamp || punch.timestamp),
        punchIn: punch,
        punchOut: punches[index + 1] || null,
      });
    }
    return acc;
  }, []);

  const CustomEvent = ({ event }) => (
    <div className="flex space-x-2">
      <div
        className="w-5 h-5 rounded-full bg-green-500 text-white flex justify-center items-center text-xs cursor-pointer"
        title={`Punch In: ${moment(event.punchIn.timestamp).format("hh:mm A")}`}
      >
        P
      </div>
      {event.punchOut && (
        <div
          className="w-5 h-5 rounded-full bg-red-500 text-white flex justify-center items-center text-xs cursor-pointer"
          title={`Punch Out: ${moment(event.punchOut.timestamp).format("hh:mm A")}`}
        >
          O
        </div>
      )}
    </div>
  );

  const handleSelectEvent = (event) => setSelectedPunch(event);

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = moment(slotInfo.start).format("YYYY-MM-DD");
    const datePunches = groupedPunches.filter((punch) =>
      moment(punch.start).isSame(selectedDate, "day")
    );
    setSelectedDatePunches(datePunches);
  };

  const handleCloseModal = () => {
    setSelectedPunch(null);
    setSelectedDatePunches([]);
  };

  const exportToExcel = () => {
    const activeMonthStart = moment(activeMonth).startOf("month");
    const activeMonthEnd = moment(activeMonth).endOf("month");
    const monthlyPunches = groupedPunches.filter((punch) =>
      moment(punch.start).isBetween(activeMonthStart, activeMonthEnd, null, "[]")
    );

    const excelData = [
      ["Student Name", studentData.name],
      ["Class", studentData.class],
      ["Division", studentData.division],
      ["PRN", studentData.id],
      [],
      ["Sr. No", "Date", "Punch In", "Punch Out"],
    ];

    monthlyPunches.forEach((punch, index) => {
      excelData.push([
        index + 1,
        moment(punch.start).format("YYYY-MM-DD"),
        moment(punch.punchIn.timestamp).format("hh:mm A"),
        punch.punchOut
          ? moment(punch.punchOut.timestamp).format("hh:mm A")
          : "Unavailable",
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Attendance");
    XLSX.writeFile(
      workbook,
      `Attendance_${moment(activeMonth).format("MMMM_YYYY")}.xlsx`
    );
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center z-50 bg-opacity-50 bg-gray-800">
          <Backdrop open={true}>
            <CircularProgress />
          </Backdrop>
        </div>
      )}

      <div className="z-10">
      <Calendar
          localizer={localizer}
          events={groupedPunches}
          startAccessor="start"
          endAccessor="end"
          className="rbc-calendar"
          style={{
            height: "500px",
            maxHeight: "480px",
            overflowY: "hidden",
            width: "100%",
          }}
          views={["month"]}
          selectable
          defaultDate={new Date()}
          onNavigate={(date) => setActiveMonth(date)} // Update the active month on navigation
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          toolbar
          components={{
            event: CustomEvent,
          }}
        />
        <div className="mt-4 flex justify-end space-x-4">
        <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={exportToExcel}
          >
            Export This Month's Data to Excel
          </button>
          
        </div>
      </div>

      {selectedPunch && (
        <ReusableModal
          open={!!selectedPunch}
          onClose={handleCloseModal}
          heading={`Punch Details for ${moment(selectedPunch.start).format("MMMM Do YYYY")}`}
        >
          <div className="space-y-4">
            <h2 className="text-lg font-bold">{studentData.name}</h2>
            <p>
              <strong>Punch In:</strong>{" "}
              {moment(selectedPunch.punchIn.timestamp).format("hh:mm A")}
            </p>
            <p>
              <strong>Punch Out:</strong>{" "}
              {selectedPunch.punchOut
                ? moment(selectedPunch.punchOut.timestamp).format("hh:mm A")
                : "Unavailable"}
            </p>
          </div>
        </ReusableModal>
      )}

      {selectedDatePunches.length > 0 && (
        <ReusableModal
          open={selectedDatePunches.length > 0}
          onClose={handleCloseModal}
          heading={`Punch Details for ${moment(
            selectedDatePunches[0].start
          ).format("MMMM Do YYYY")}`}
        >
          <div className="space-y-2">
            {selectedDatePunches.map((punch, index) => (
              <div key={index}>
                <p>
                  <strong>Punch {index + 1} In:</strong>{" "}
                  {moment(punch.punchIn.timestamp).format("hh:mm A")}
                </p>
                <p>
                  <strong>Punch {index + 1} Out:</strong>{" "}
                  {punch.punchOut
                    ? moment(punch.punchOut.timestamp).format("hh:mm A")
                    : "Unavailable"}
                </p>
              </div>
            ))}
          </div>
        </ReusableModal>
      )}
    </div>
  );
};

export default StudentAttendanceCalendar;
