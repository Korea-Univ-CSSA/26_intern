import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Outlet,
} from "react-router-dom";
import { Header } from "./utils/Header";
import { Footer } from "./utils/Footer";
import { SourceCodePage } from "./page/SourceCodePage";
import { ComingSoon } from "./utils/ComingSoon";
import { CssBaseline } from "@mui/material";

import CdbPage from "./hatdb/cdb/CdbPage";
import VdbPage from "./hatdb/vdb/VdbPage";

// 🔹 RootLayout을 추가하여 모든 페이지에서 Header와 Footer 사용
const RootLayout = () => {
  return (
    <>
      <CssBaseline />
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet /> {/* ✅ 현재 페이지가 여기에 렌더링됨 */}
      </main>
      <Footer />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<SourceCodePage />} />
      <Route path="/hatdb/cdb" element={<CdbPage />} />
      <Route path="/hatdb/vdb" element={<VdbPage />} />
      <Route path="/docs" element={<ComingSoon />} />
      <Route path="/statistics" element={<ComingSoon />} />
      <Route path="/contact-us" element={<ComingSoon />} />
      {/* <Route
        path="/user-guide"
        element={<UserGuidePdf srcEn={guideEn} srcKo={guideKo} />}
      /> */}
      <Route path="/user-guide" element={<ComingSoon />} />

      {/* 아직 개발 중인 페이지라는 표시해주는 컴포넌트 */}
      <Route path="/coming-soon" element={<ComingSoon />} />
    </Route>
  )
);

const App = () => {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true, // ✅ 여기에서 옵션을 설정해야 한다!
        v7_relativeSplatPath: true,
      }}
    />
  );
};

export default App;
