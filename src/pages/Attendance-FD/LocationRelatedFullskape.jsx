import {
    CircleF,
    DrawingManagerF,
    GoogleMap,
    MarkerF,
  } from "@react-google-maps/api";
  import React from "react";
import useFullskapeMap from "./useFullskapeMap";
import BasicButton from "../../components/BasicButton";
  
  const LocationRelatedFullskape = ({ watch, data, onClose, zoneId, zoneData }) => {
    const {
      circleRef,
      circleComplete,
      mapRef,
      drawingRef,
      circle,
      addCircleMutate,
    } = useFullskapeMap({
      watch,
      onClose,
    });

    console.log("zoneData", zoneData);
  
    return (
      <div className="h-full w-full flex flex-col items-center">
        <GoogleMap
          mapContainerClassName="h-[400px] w-full rounded-lg shadow-lg relative"
          center={data}
          options={{
            disableDefaultUI: true,
          }}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          zoom={12}
        >
          {watch("location") && watch("location")?.position && (
            <MarkerF position={watch("location")?.position} />
          )}
          {circle === null && (
            <DrawingManagerF
              drawingMode={null}
              onCircleComplete={circleComplete}
              options={{
                drawingControlOptions: {
                  position: window.google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: ["circle"],
                },
                circleOptions: {
                  fillColor: `#ff5733`, // Different color for Fullskape
                  strokeColor: "#ff5733",
                  fillOpacity: 0.5,
                  strokeWeight: 2,
                  clickable: true,
                  editable: false,
                  zIndex: 1,
                  draggable: true,
                },
                drawingControl: true,
              }}
              onLoad={(drawingManager) => {
                drawingRef.current = drawingManager;
              }}
            />
          )}
          {zoneId ? (
            <CircleF
              center={{
                lat: zoneData?.center?.lat,
                lng: zoneData?.center?.lng,
              }}
              radius={zoneData?.radius}
              options={{
                strokeColor: "#ff5733", // Match the Fullskape color
                fillColor: "#ff5733",
                fillOpacity: 0.35,
                strokeWeight: 2,
              }}
            />
          ) : (
            circle && (
              <CircleF
                center={circle?.center}
                radius={circle?.radius}
                options={{
                  fillColor: `#ff5733`,
                  strokeColor: "#ff5733",
                  fillOpacity: 0.5,
                  strokeWeight: 2,
                  clickable: true,
                  editable: false,
                  zIndex: 1,
                  draggable: true,
                }}
                onLoad={(circle) => {
                  circleRef.current = circle;
                }}
              />
            )
          )}
        </GoogleMap>
        {zoneId ? null : (
          <BasicButton
            className="mt-2"
            title="Add Fullskape Zone"
            onClick={addCircleMutate}
            disabled={!circle?.center?.lat}
            variant="contained"
          />
        )}
      </div>
    );
  };
  
  export default LocationRelatedFullskape;
  