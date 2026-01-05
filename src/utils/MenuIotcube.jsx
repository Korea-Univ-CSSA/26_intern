// Iotcube 1.0 메뉴 dropdown 컴포넌트 - hover version (cssa 김선규, 251118)

import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

const menuData = [
  {
    title: "SBOM",
    items: [
      {
        label: "SCA",
        children: [
          { label: "cosim", url: "https://iotqv.korea.ac.kr/sbom/cosim" },
        ],
      },
      {
        label: "Hatbom",
        children: [
          {
            label: "view,translate",
            url: "https://iotqv.korea.ac.kr/sbom/hatbom2",
          },
          {
            label: "merge,diff",
            url: "https://iotqv.korea.ac.kr/sbom/hatbom3",
          },
          {
            label: "validate",
            url: "https://iotqv.korea.ac.kr/sbom/hatbom4",
          },
        ],
      },
      {
        label: "Binbom",
        children: [
          {
            label: "build",
            url: "https://iotqv.korea.ac.kr/sbom/binbom",
          },
        ],
      },
    ],
  },
  {
    title: "SAST",
    items: [
      {
        label: "Source",
        children: [
          {
            label: "ddinfer",
            url: "https://iotqv.korea.ac.kr/sast/ddinfer",
          },
        ],
      },
      {
        label: "Binary",
        children: [
          {
            label: "qkbcc",
            url: "https://iotqv.korea.ac.kr/sast/qkbcc",
          },
          { label: "pfuzz", url: "https://iotqv.korea.ac.kr/sast/pfuzz" },
        ],
      },
      {
        label: "Contract",
        children: [
          {
            label: "veris",
            url: "https://iotqv.korea.ac.kr/sast/veris",
          },
          {
            label: "prost",
            url: "https://iotqv.korea.ac.kr/sast/prost",
          },
        ],
      },
    ],
  },
  {
    title: "DAST",
    items: [
      {
        label: "Protocol",
        children: [
          { label: "wireless", url: "https://iotqv.korea.ac.kr/dast/wireless" },
        ],
      },
      {
        label: "EVM",
        children: [
          {
            label: "evmfuzz",
            url: "https://iotqv.korea.ac.kr/dast/evmfuzz",
          },
        ],
      },
      {
        label: "BINARY",
        children: [
          {
            label: "gcfuzz",
            url: "https://iotqv.korea.ac.kr/dast/gcfuzz",
          },
        ],
      },
      {
        label: "Network",
        children: [
          { label: "nscan", url: "https://iotqv.korea.ac.kr/dast/nscan" },
          { label: "bscan", url: "https://iotqv.korea.ac.kr/dast/bscan" },
        ],
      },
    ],
  },
];

export default function IotcubeMenu() {
  const [hoverOpen, setHoverOpen] = useState(false);

  const openUrl = (url) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <Box
      onMouseEnter={() => setHoverOpen(true)}
      onMouseLeave={() => setHoverOpen(false)}
      sx={{ position: "relative", display: "inline-block" }}
    >
      {/* Main menu button */}
      <Button
        sx={{
          color: "gray",
          textTransform: "none",
          fontWeight: 500,
          px: 2,
        }}
      >
        Iotcube 1.0
      </Button>

      {/* Hover-menu */}
      {hoverOpen && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "14px 18px",
            zIndex: 2000,
            display: "flex",
            gap: 4,
            minWidth: "700px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
          }}
        >
          {menuData.map((col) => (
            <Box key={col.title} sx={{ flex: 1 }}>
              {/* Column Title */}
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "15px",
                  mb: 1,
                  borderBottom: "2px solid #555",
                  pb: "4px",
                }}
              >
                {col.title}
              </Typography>

              {/* Groups */}
              {col.items.map((group) => (
                <Box key={group.label} sx={{ mb: 1.5 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "14px",
                      mb: 0.5,
                      color: "#111",
                    }}
                  >
                    {group.label}
                  </Typography>

                  {/* Link Items */}
                  {group.children?.map((leaf) => (
                    <Typography
                      key={leaf.label}
                      onClick={() => openUrl(leaf.url)}
                      sx={{
                        cursor: "pointer",
                        fontSize: "13px",
                        ml: 1,
                        mb: "2px",
                        color: "#0A58CA",
                        "&:hover": {
                          textDecoration: "underline",
                          color: "#003f80",
                        },
                      }}
                    >
                      • {leaf.label}
                    </Typography>
                  ))}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
