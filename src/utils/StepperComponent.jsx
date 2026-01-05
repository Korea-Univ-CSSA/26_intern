import React, { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  responsiveFontSizes,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import useStepStore from "../stores/useStepStore";
import useVulStore from "../stores/useVulStore";
import useVexStore from "../stores/useVexStore";
import useClientData from "../stores/useClientData";

// 아이콘 커스터마이징: 마지막 스텝에만 아이콘 적용
const CustomStepIcon = (props) => {
  const { active, completed, icon } = props;
  const index = Number(icon) - 0; // "1" → 0번 인덱스

  return (
    <Box
      sx={{
        backgroundColor: active || completed ? "#8e5959" : "#ccc",
        borderRadius: "50%",
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
      }}
    >
      {index === 3 ? <DescriptionIcon fontSize="small" /> : icon}
    </Box>
  );
};

const StepperComponent = () => {
  const steps = ["SBOM", "Vulnerability", "VEX", "Result"];
  const { step, increase, decrease, setStep } = useStepStore();
  const [activeStep, setActiveStep] = useState(step || 0);

  const { vexReturn, response } = useVulStore();
  const { finishAnalysis, vexLock } = useVexStore();
  const { sbomFile, cnepsState } = useClientData();

  useEffect(() => {
    if (step >= 0 && step < steps.length) {
      setActiveStep(step);
    }
  }, [step]);

  const handleStepClick = (index) => {
    // console.log("finishAnalysis 확인 : ", finishAnalysis);
    // if (index === activeStep) return;
    // const currentStep = steps[step];
    // // console.log("현재 스테퍼 : ", currentStep);
    // //------------------------------------ 스테퍼 상향할때 설정 ---------------------
    // if (index > activeStep) {
    //   //--------------------------------- 각 스텝 별 제한 조건
    //   if (currentStep === "SBOM" && !sbomFile) {
    //     alert("Please proceed once the SBOM generation is complete.");
    //     return;
    //   }
    //   if (currentStep === "SBOM" && steps[index] === "VEX") {
    //     if (!response) {
    //       alert("Please proceed Vulnerability step first.");
    //       return;
    //     }
    //   }
    //   if (currentStep === "SBOM" && cnepsState === "started") {
    //     alert("Please proceed once the Cneps generation is complete.");
    //     return;
    //   }
    //   if (currentStep === "Vulnerability" && !response) {
    //     alert("Please wait the VUDDY detection is complete.");
    //     return;
    //   }
    //   if (currentStep === "VEX" && !finishAnalysis) {
    //     alert("Please proceed after the static analysis is complete.");
    //     return;
    //   }
    //   //------------------------------- cve 아무것도 선택 안했을때
    //   if (
    //     currentStep === "Vulnerability" &&
    //     !vexReturn?.raw_data?.length &&
    //     !vexLock
    //   ) {
    //     const proceed = window.confirm(
    //       "No CVEs have been selected. Do you still want to proceed?"
    //     );
    //     if (!proceed) return;
    //   }
    //   setStep(index);
    // }
    // // ----------------------------------- 스테퍼 하향할때 설정
    // if (index < activeStep) {
    //   if (currentStep === "VEX" && !finishAnalysis) {
    //     alert("Please proceed after the static analysis is complete.");
    //     return;
    //   }
    //   setStep(index);
    // }
  };

  return (
    <Box sx={{ width: "100%", padding: "0 0 20px 0", marginTop: "30px" }}>
      <Stepper
        activeStep={activeStep}
        orientation="horizontal"
        sx={{
          display: "flex",
          justifyContent: "space-between", // ✅ 양 끝 정렬
          width: "100%",
          px: 1,
          "& .MuiStep-root": {
            cursor: "pointer",
            flex: "0 0 auto", // ✅ 고정 너비 노드
          },
          "& .Mui-disabled": {
            pointerEvents: "auto",
            cursor: "pointer",
          },
          "& .MuiStepConnector-root": {
            pointerEvents: "none",
          },
          "& .MuiStepConnector-line": {
            pointerEvents: "none",
          },
        }}
      >
        {steps.map((label, index) => (
          <Step key={label} onClick={() => handleStepClick(index)}>
            <StepLabel slots={{ stepIcon: CustomStepIcon }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StepperComponent;
