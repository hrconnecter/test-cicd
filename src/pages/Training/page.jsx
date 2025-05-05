import React from "react";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import TrainingTable from "./training-table/page";

const HrTrainings = () => {
  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading={"Trainings"}
        info={"Click on add new training button to create trainings"}
      />
      <TrainingTable />
    </BoxComponent>
  );
};

export default HrTrainings;
