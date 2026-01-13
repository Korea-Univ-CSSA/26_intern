import React from "react";
import { Box, Typography, Stack, Container } from "@mui/material";
import StepperComponent from "../utils/StepperComponent";
import SBOMComponent from "../utils/ComingSoon";

import useStepStore from "../stores/useStepStore";
import useClientData from "../stores/useClientData";
import ResultComponent from "../utils/ComingSoon";
import VulnerabilityComponent from "../vulnerabilityComponents/VulnerabilityComponent";
import VEXComponent from "../utils/ComingSoon";

export const SourceCodePage = () => {
  const { step } = useStepStore();
  const { tempFolderPath } = useClientData();

  const tags = ["Hatbom", "VUDDY", "VEX"];
  const colors = ["#fc6868", "#68c7fc", "#c168fc"];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <Typography>Main page</Typography>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "rgb(247, 243, 236)",
          textAlign: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box component="main" sx={{ width: "100%" }}>
          <Typography
            variant="h4"
            sx={{
              color: "rgb(139, 53, 53)",
              fontWeight: "bold",
              mt: 8,
            }}
          >
            Source Code
          </Typography>
          <Stack direction="row" spacing={1} mt={2} justifyContent={"center"}>
            {tags.map((tag, index) => (
              <Typography
                key={index}
                component="span"
                sx={{
                  borderRadius: 4,
                  px: 2,
                  py: 0.5,
                  backgroundColor: colors[index],
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "12px",
                }}
              >
                {tag}
              </Typography>
            ))}
          </Stack>

          <Typography
            variant="body2"
            sx={{
              color: "#4b4b4b",
              mt: 2,
              marginBottom: 2,
            }}
          >
            This is the Source Code Upload Type SBOM/Vulnerability List/VEX
            Generation Page.
            <br />
            Our Core Engines are highly optimized and efficient in generating
            SBOM, Vulnerability Lists, and VEX Generation Pages from source
            code.
          </Typography>
        </Box>
      </Box>

      {/* SBOMProcess -> VulnerabilityProcess -> VEXProcess */}
      <Box
        component="section"
        sx={{ width: "100%", maxWidth: "1200px", marginBottom: "30px" }}
      >
        <StepperComponent />
        {step === 0 && <SBOMComponent />}
        {step === 1 && (
          <VulnerabilityComponent tempFolderPath={tempFolderPath} />
        )}
        {step === 2 && <VEXComponent />}
        {step === 3 && <ResultComponent />}
      </Box>
    </Box>
  );
};

export default SourceCodePage;
