import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Toolbar,
} from "@mui/material";
import {
  People,
  MoneyOff,
  History,
  AccountBalance,
  HistoryOutlined,
  StarBorder,
  TocOutlined,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/config/constants";

const Sidebar = ({ onMenuItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const adminMenuItems = [
    {
      text: "Quản lý người dùng",
      icon: <People />,
      path: ROUTES.USER_MANAGEMENT,
      roles: ["admin"],
    },
    {
      text: "Quản lý nạp rút",
      icon: <MoneyOff />,
      path: ROUTES.DEPOSIT_MANAGEMENT,
      roles: ["admin"],
    },
    {
      text: "Lịch sử nạp rút",
      icon: <History />,
      path: ROUTES.HISTORY_DEPOSIT_MANAGEMENT,
      roles: ["admin"],
    },
    {
      text: "Quản lý dữ liệu",
      icon: <TocOutlined />,
      path: ROUTES.ORDER_MANAGEMENT,
      roles: ["admin"],
    },
    {
      text: "Quản lý phòng",
      icon: <TocOutlined />,
      path: ROUTES.ROOM_MANAGEMENT,
      roles: ["admin"],
    },
    {
      text: "Quản lý kết quả phiên",
      icon: <HistoryOutlined />,
      path: ROUTES.HISTORY_SESSION_MANAGEMENT,
      roles: ["admin"],
    },
    {
      text: "Cấu hình ngân hàng",
      icon: <AccountBalance />,
      path: ROUTES.BANK_MANAGEMENT,
      roles: ["admin"],
    },
    {
      text: "Quản lý khuyến mãi",
      icon: <StarBorder />,
      path: ROUTES.PROMOTION_MANAGEMENT,
      roles: ["admin"],
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const filteredAdminItems = adminMenuItems.filter(
    (item) => item.roles.includes("admin") || item.roles.includes(user?.role)
  );
  // const filteredMenuItems = menuItems.filter((item) =>
  //   item.roles.includes(user?.role)
  // );

  // const filteredAdminItems = adminMenuItems.filter((item) =>
  //   item.roles.includes(user?.role)
  // );

  return (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          My App
        </Typography>
      </Toolbar>

      <Divider />
      <List>
        {filteredAdminItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                handleNavigation(item.path);
                onMenuItemClick();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
