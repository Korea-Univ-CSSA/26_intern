import React from "react";
import { Box, Button, Link } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIotcube from "./MenuIotcube";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [hoverHatDB, setHoverHatDB] = React.useState(false);

  // width rules by path
  const widthMapByPath = [
    { prefix: "/hatdb/cdb", maxWidth: 1020 },
    { prefix: "/hatdb/vdb", maxWidth: 1020 },
    { prefix: "/hatdb", maxWidth: 1020 },
    { prefix: "/statistics", maxWidth: 1020 },
    { prefix: "/user-guide", maxWidth: 1300 },
    { prefix: "/contact-us", maxWidth: 1080 },
    { prefix: "/source-code", maxWidth: 1250 },
    { prefix: "/", maxWidth: 980 },
  ];

  const getContainerMaxWidth = () => {
    return (
      widthMapByPath.find((r) => location.pathname.startsWith(r.prefix))
        ?.maxWidth || 1200
    );
  };

  const containerMaxWidth = getContainerMaxWidth();

  const hatDBMenu = [
    { label: "OSS List", path: "/hatdb/cdb" },
    { label: "CVE List", path: "/hatdb/vdb" },
  ];

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "rgb(247, 243, 236)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: `${containerMaxWidth}px`,
          px: 2,
          mx: "auto",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 64,
        }}
      >
        {/* Logo */}
        <Link
          href="http://localhost:3000/"
          underline="none"
          sx={{
            fontSize: 24,
            fontWeight: "bold",
            whiteSpace: "nowrap",
            px: 1.5,
            py: 0.5,
            borderRadius: "6px",
            color: "rgb(97, 30, 3)",
            cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(180,180,180,0.25)" },
          }}
        >
          IoTcube Hatbom
        </Link>

        {/* Navigation Menu */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexGrow: 1,
            justifyContent: { xs: "center", md: "flex-end" },
            ml: 2,
          }}
        >
          {/* HatDB - Hover dropdown */}
          <Box
            sx={{ position: "relative" }}
            onMouseEnter={() => setHoverHatDB(true)}
            onMouseLeave={() => setHoverHatDB(false)}
          >
            <Button
              disableRipple
              sx={{
                color: "gray",
                textTransform: "none",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              HatDB
            </Button>

            {hoverHatDB && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "#fff",
                  border: "1px solid #aaa",
                  borderRadius: "6px",
                  p: 1,
                  zIndex: 2000,
                  minWidth: "150px",
                  boxShadow: "0px 3px 10px rgba(0,0,0,0.15)",
                }}
              >
                {hatDBMenu.map((item) => (
                  <Box
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    sx={{
                      px: 1,
                      py: 0.8,
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
                    }}
                  >
                    {item.label}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Fixed buttons */}
          {[
            { label: "Statistics", path: "/statistics" },
            { label: "User Guide", path: "/user-guide" },
          ].map((item) => (
            <Button
              key={item.label}
              sx={{ color: "gray", fontWeight: 500, textTransform: "none" }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          ))}

          {/* Iotcube Multi-column Menu */}
          <MenuIotcube />

          {/* Others */}
          {[
            { label: "CSSA", url: "https://cssa.korea.ac.kr" },
            { label: "Contact us", path: "/contact-us" },
          ].map(({ label, path, url }) =>
            url ? (
              <Button
                key={label}
                component="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "gray", fontWeight: 500, textTransform: "none" }}
              >
                {label}
              </Button>
            ) : (
              <Button
                key={label}
                onClick={() => navigate(path)}
                sx={{ color: "gray", fontWeight: 500, textTransform: "none" }}
              >
                {label}
              </Button>
            )
          )}
        </Box>
      </Box>
    </Box>
  );
};
