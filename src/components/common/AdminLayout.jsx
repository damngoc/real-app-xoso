import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "@/css/AdminLayout.scss";
import { BreadcrumbProvider } from "../../contexts/BreadcrumbContext";
// import { useAuth } from "@/contexts/AuthContext";

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  //   const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Khi chọn menu xong thì ẩn sidebar trên mobile
  const handleMenuItemClick = () => {
    if (isMobile) setMobileOpen(false);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <BreadcrumbProvider>
      <div
        className="admin-layout"
        style={{ marginLeft: isMobile ? 0 : `${drawerWidth}px` }}
      >
        <CssBaseline />
        <div>
          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            <Sidebar onMenuItemClick={handleMenuItemClick} />
          </Drawer>
        </div>
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
            }}
          >
            <Header onMenuClick={handleDrawerToggle} />
          </AppBar>
          <div className="body flex-grow-1">
            <p className="text-sm text-red-600 mb-4 rounded-lg bg-red-100 p-2">
              Website này sử dụng để test và học hỏi kĩ thuật dev. Không sử dụng
              cho mục đích khác{" "}
            </p>
            <Box component="main">
              {/* <Toolbar /> */}
              <Outlet />
            </Box>
          </div>
        </div>
      </div>
    </BreadcrumbProvider>
  );
};

export default Layout;
