import React from "react";
import {
  Box,
  Typography,
  Container,
  Stack,
  Divider,
  Link,
} from "@mui/material";

import cssa_address from "../assets/images/header/cssa_address.png";
import labradorlabs_address from "../assets/images/main_page/labradorlabs_address.svg";

const footerLinks = [
  {
    title: "Participating Organizations",
    links: [
      { label: "Korea University", href: "https://www.korea.ac.kr" },
      { label: "KAIST", href: "https://www.kaist.ac.kr/kr/" },
      { label: "Carnegie Mellon University", href: "https://www.cmu.edu" },
      { label: "University of Oxford", href: "https://www.ox.ac.uk" },
      { label: "ETH Zürich", href: "https://ethz.ch" },
      { label: "KISA", href: "https://www.kisa.or.kr" },
    ],
  },
];

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        bgcolor: "rgb(247, 243, 236)",
        color: "rgb(139, 53, 53)",
        fontWeight: "bold",
        py: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Container maxWidth={false} sx={{ width: "1000px" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          justifyContent="space-between"
          flexWrap="wrap"
          mb={4}
        >
          {/* Links Section */}
          <Box sx={{ flex: 1, minWidth: "300px" }}>
            {footerLinks.map((section, index) => (
              <Box key={index} mb={3}>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  {section.title}
                </Typography>
                {section.links.map((link, linkIndex) => (
                  <Typography
                    key={linkIndex}
                    component="div"
                    sx={{ mb: 0.5, fontWeight: "normal" }}
                  >
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{ color: "rgb(80, 80, 80)", fontSize: "14px" }}
                    >
                      {link.label}
                    </Link>
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>

          {/* Info Section */}
          <Box sx={{ flex: 1, minWidth: "300px" }}>
            <Box mb={3}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Cookies
              </Typography>
              <Typography variant="body2" sx={{ color: "rgb(80, 80, 80)" }}>
                We use cookies to support file uploading. Please enable cookies
                to use IoTcube.
              </Typography>
            </Box>

            <Box mb={3}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Notification
              </Typography>
              <Typography variant="body2" sx={{ color: "rgb(80, 80, 80)" }}>
                Labrador Labs owns the patents of Vuddy and Centris
                technologies. Please contact{" "}
                <Link
                  href="https://labradorlabs.ai/"
                  underline="hover"
                  sx={{ color: "#0070cc", fontSize: "14px" }}
                >
                  Labrador Labs
                </Link>{" "}
                for licensing information.{" "}
                <Box
                  component="img"
                  src={labradorlabs_address}
                  alt="labradorlabs_address"
                  onClick={() =>
                    (window.location.href = "mailto:contact@labradorlabs.ai")
                  }
                  sx={{
                    display: "inline-block",
                    height: "1.3em",
                    objectFit: "contain",
                    cursor: "pointer",
                    borderRadius: "8px",
                    transform: "translateY(4px)",
                  }}
                />
              </Typography>
            </Box>
          </Box>
        </Stack>

        {/* Divider */}
        <Divider sx={{ my: 3, borderColor: "rgba(0, 0, 0, 0.1)" }} />

        {/* Copyright */}
        <Box textAlign="center">
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Korea Univ. CSSA Center for Software Security and Assurance
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgb(80, 80, 80)", marginTop: 1 }}
          >
            Send an email to{" "}
            <Box
              component="img"
              src={cssa_address}
              alt="cssa_address"
              onClick={() => (window.location.href = "mailto:cssa@korea.ac.kr")}
              sx={{
                display: "inline-block",
                height: "1.3em",
                objectFit: "contain",
                cursor: "pointer",
                borderRadius: "8px",
                transform: "translateY(4px)",
              }}
            />
            regarding bugs or suggestions.
          </Typography>
          <Typography variant="caption" sx={{ color: "rgb(80, 80, 80)" }}>
            © 2025. All rights reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
