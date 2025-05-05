/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
 
import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import useGetUser from "../../hooks/Token/useUser";
import SelfOTest1 from "./EmployeeCom/SelfOTest1";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";


// Validation functions
const isValidPanCard = (panCard) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panCard);
const isValidAadharCard = (aadharCard) => /^\d{12}$/.test(aadharCard);

const SelfEmployeeTest = () => {
  const { authToken } = useGetUser();
  const fileInputRef = useRef(null);
  const { setAppAlert } = useContext(UseContext);
  // eslint-disable-next-line no-unused-vars
  const [org, setOrg] = useState();

  // eslint-disable-next-line no-unused-vars
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelfOnboarded, setIsSelfOnboarded] = useState(false);
  const [members, setMembers] = useState();

  const orgId = useParams().organisationId;

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/get/${orgId}`
      );
      setOrg(resp.data.organizations);
      setIsSelfOnboarded(resp.data.user?.isSelfOnboard);
    })();
  }, [orgId]);

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/getmembers/${orgId}`
      );
      setMembers(resp.data.members);
    })();
  }, [orgId]);

  return (

    
   
    <div className=" min-h-screen h-auto ">
      {isLoading && (
        <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
          <CircularProgress />
        </div>
      )}
      

      <section className="md:px-8 flex space-x-2 md:py-6">
        <article className="w-full rounded-lg bg-white">
          <div className="w-full md:px-5 px-1">
            <SelfOTest1></SelfOTest1>
          </div>
        </article>
      </section>
    </div>
 
  );
};

export default SelfEmployeeTest;

