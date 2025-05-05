import React, { useEffect, useState } from "react";
import useEmployeeListStore from "../Mutation/employeeListStore";

const TableComponent = ({ register, setValue, watch, addedEmployee = [] }) => {
  const { employeeList } = useEmployeeListStore();
  const [loading, setLoading] = useState(true); // Add loading state
  const allSelected = watch("selectAll");

  useEffect(() => {
    if (employeeList.length > 0) {
      setLoading(false); // Set loading to false once employeeList is fetched
    }
  }, [employeeList]);

  useEffect(() => {
    const updatedValues = {};
    let shouldUpdate = false;

    employeeList.forEach((item) => {
      const isSelected = allSelected || addedEmployee.some(emp => emp._id === item._id);
      if (watch(`${item._id}`) !== isSelected) {
        updatedValues[`${item._id}`] = isSelected;
        shouldUpdate = true;
      }
    });

    if (shouldUpdate) {
      Object.entries(updatedValues).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, employeeList, addedEmployee, allSelected]); // Update dependencies

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setValue("selectAll", checked);
    employeeList.forEach((item) => {
      setValue(`${item._id}`, checked);
    });
  };


  return (
    <table className="min-w-full bg-white text-left !text-sm font-light">
      <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
        <tr className="!font-semibold">
          <th scope="col" className="text-center py-3 w-1/12">
            <input
              type="checkbox"
              {...register("selectAll")}
              onChange={handleSelectAll}
              checked={allSelected}
              disabled={loading} // Disable checkbox while loading
            />
          </th>
          <th scope="col" className="py-3 w-2/12">
            First Name
          </th>
          <th scope="col" className="py-3 w-2/12">
            Last Name
          </th>
          <th scope="col" className="py-3 w-2/12">
            Email
          </th>
        </tr>
      </thead>
      <tbody>
        {loading ? ( // Show loading message while fetching data
          <tr>
            <td colSpan="4" className="text-center py-4">
              Loading employees...
            </td>
          </tr>
        ) : (
          employeeList?.map((item) => (
            <tr
              key={item._id}
              className="border-b border-gray-200 dark:border-neutral-700"
            >
              <td className="py-4 text-center">
                <input
                  {...register(`${item._id}`)}
                  type="checkbox"
                  className="checkbox"
                  value={item._id}
                  checked={watch(`${item._id}`)}
                />
              </td>
              <td className="py-4">{item.first_name}</td>
              <td className="py-4">{item.last_name}</td>
              <td className="py-4">{item.email}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default TableComponent;
