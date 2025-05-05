

import { MoreVert, MyLocation, People } from "@mui/icons-material"
import { Button, IconButton, Menu, MenuItem } from "@mui/material"
import React from "react"
import useGetCurrentLocation from "../../../hooks/Location/useGetCurrentLocation"
import useGetRevGeo from "../../Geo-Fence/useGetRevGeo"
import ManageEmployeeModal from "./ManageEmployeeModal"
import ReusableModal from "../../../components/Modal/component"
import FoundationModal from "./FoundationModal"
import axios from "axios"
import { TestContext } from "../../../State/Function/Main"
import { useQueryClient } from "react-query"
import { useParams } from "react-router-dom"
import BasicButton from "../../../components/BasicButton"

const GeoFenceCard = ({ item }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [open1, setOpen1] = React.useState(false)
  const [view, setView] = React.useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)
  const {handleAlert} = React.useContext(TestContext)
  const queryClient = useQueryClient()

  const { data: locationData } = useGetCurrentLocation()
  const {organisationId} = useParams("")

  const { data } = useGetRevGeo({
    lat: item?.center?.coordinates[0],
    lng: item?.center?.coordinates[1],
  })

  //   const { mutate } = useGeoMutation();

  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API}/route/foundation-geo-fence/${item?._id}/${organisationId}`)
      handleAlert(true, "success", "Geofence zone deleted successfully")
      await queryClient.invalidateQueries(["foundationSetup", organisationId])
      setDeleteModalOpen(false)
    } catch (error) {
      console.error("Failed to delete geofence zone:", error)
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden w-full max-w-xs">
      {/* Top colored bar */}
      <div className="h-1.5 bg-gradient-to-r from-blue-400 to-blue-500 w-full"></div>

      <div className="p-3">
        {/* Header with location and menu */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 rounded-full p-1.5 flex items-center justify-center">
              <MyLocation className="text-blue-500 h-3.5 w-3.5" />
            </div>
            <abbr title={data ? data[0]?.formatted_address : "Loading..."} className="no-underline">
              <h4 className="text-sm font-medium text-gray-800 truncate w-36">
                {data ? data[0]?.formatted_address : "Loading..."}
              </h4>
            </abbr>
          </div>

          <IconButton
            onClick={handleClick}
            size="small"
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <MoreVert className="h-4 w-4" />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                setView(true)
                handleClose()
              }}
            >
              View
            </MenuItem>
            <MenuItem
              onClick={() => {
                setDeleteModalOpen(true)
                handleClose()
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

        {/* Employee count */}
        <div className="flex items-center mb-3 bg-gray-50 rounded-md p-2">
          <div className="bg-blue-50 rounded-full p-1 mr-2">
            <People className="text-blue-400 h-3.5 w-3.5" />
          </div>
          <p className="text-xs text-gray-600">
            <span className="font-medium">Employee Count:</span>{" "}
            <span className="text-blue-600 font-semibold">{item?.employee?.length || 0}</span>
          </p>
        </div>

        {/* Action button */}
        <div className="flex justify-end">
          <Button
            onClick={() => setOpen1(true)}
            variant="contained"
            size="small"
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded-full shadow-sm"
          >
            Manage Employees  
          </Button>
        </div>
      </div>

       <ReusableModal
        open={open1}
        heading={"Add Or Remove Employees"}
        subHeading={`Here you can add or remove employees in geofencing zone`}
        onClose={() => setOpen1(false)}
      >
        <ManageEmployeeModal circleId={item?._id} onClose={() => setOpen1(false)} />
      </ReusableModal>
      <div>
        <ReusableModal
          open={view}
          heading={"View Geo Fencing"}
          subHeading={"You can activate geofencing for a specific zone"}
          onClose={() => setView(false)}
        >
          <FoundationModal onClose={() => setView(false)} data={locationData} circleId={item?._id} />
        </ReusableModal>
      </div>
      <ReusableModal
        open={deleteModalOpen}
        heading={"Delete Geo Fencing Zone"}
        subHeading={"Are you sure you want to delete this geofencing zone? This action cannot be undone."}
        onClose={() => setDeleteModalOpen(false)}
      >
        <div className="flex justify-end py-4 gap-2">
          <BasicButton variant={"text"}   onClick={() => setDeleteModalOpen(false)} title={"Cancel"} color={"danger"}  />
         
         <BasicButton
            variant={"contained"}
            onClick={handleDelete}
            title={"Delete"}
            color={"danger"}
          />
        
        </div>
      </ReusableModal>
    </div>
  )
}

export default GeoFenceCard

