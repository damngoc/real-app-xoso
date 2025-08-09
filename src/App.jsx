import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLayout from "@/components/common/AdminLayout";
import PrivateRoute from "@/components/common/PrivateRoute";
import { ROUTES } from "@/config/constants";

// Pages
import LoginPage from "@/pages/auth/LoginPage";
import Login from "@/pages/user/Login";
import RegisterPage from "@/pages/auth/RegisterPage";
import UserManagement from "@/pages/admin/UserManagement";
import UserDashboard from "@/pages/user/UserDashboard";
import Profile from "@/pages/user/Profile";
import { AuthProvider } from "@/contexts/AuthContext";
import UserLayout from "@/components/common/UserLayout";
import BankTransfer from "@/pages/user/BankTransfer";
import GameDaiPhat from "@/pages/user/components/GameDaiPhat";
import DepositManagement from "@/pages/admin/DepositManagement";
import HistoryDepositManagement from "@/pages/admin/HistoryDepositManagement";
import OrderManagement from "@/pages/admin/OrderManagement";
import HistoryOrderManagement from "@/pages/admin/HistoryOrderManagement";
import BankManagement from "@/pages/admin/BankManagement";
import PromotionManagement from "@/pages/admin/PromotionManagement";
import CustomerService from "@/pages/user/CustomerService";
import Promotion from "@/pages/user/Promotion";
import Bank from "@/pages/user/components/bank";
import AddBank from "@/pages/user/components/AddBank";
import Withdraw from "@/pages/user/components/Withdraw";
import TransactionDetails from "@/pages/user/components/TransactionDetails";
import OrdersHistory from "@/pages/user/components/OrdersHistory";
import MyAccount from "@/pages/user/components/MyAccount";
import ChangePassword from "@/pages/user/components/ChangePassword";
import LotteryHistory from "@/pages/user/components/LotteryHistory";
import HistorySessionManagement from "@/pages/admin/HistorySessionManagement";
import ForgotPassword from "@/pages/user/components/forgotPassword";
import RoomManagement from "@/pages/admin/RoomManagement";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path={ROUTES.LOGIN_ADMIN} element={<LoginPage />} />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRole="admin">
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route
                path={ROUTES.USER_MANAGEMENT}
                element={<UserManagement />}
              />
              <Route
                path={ROUTES.DEPOSIT_MANAGEMENT}
                element={<DepositManagement />}
              />
              <Route
                path={ROUTES.HISTORY_DEPOSIT_MANAGEMENT}
                element={<HistoryDepositManagement />}
              />
              <Route
                path={ROUTES.ORDER_MANAGEMENT}
                element={<OrderManagement />}
              />
              <Route
                path={ROUTES.HISTORY_ORDER_MANAGEMENT}
                element={<HistoryOrderManagement />}
              />
              <Route
                path={ROUTES.HISTORY_SESSION_MANAGEMENT}
                element={<HistorySessionManagement />}
              />
              <Route
                path={ROUTES.BANK_MANAGEMENT}
                element={<BankManagement />}
              />
              <Route
                path={ROUTES.ROOM_MANAGEMENT}
                element={<RoomManagement />}
              />
              <Route
                path={ROUTES.PROMOTION_MANAGEMENT}
                element={<PromotionManagement />}
              />
              <Route
                index
                element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />}
              />
            </Route>

            {/* User routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <UserLayout />
                </PrivateRoute>
              }
            >
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              <Route path={ROUTES.DASHBOARD} element={<UserDashboard />} />
              <Route path={ROUTES.GAME} element={<GameDaiPhat />} />
              <Route path={ROUTES.DEPOSIT} element={<BankTransfer />} />
              <Route path={ROUTES.PROMOTION} element={<Promotion />} />
              <Route
                path={ROUTES.CUSTOMER_SERVICE}
                element={<CustomerService />}
              />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              <Route path={ROUTES.BANK} element={<Bank />} />
              <Route path={ROUTES.ADD_BANK} element={<AddBank />} />
              <Route path={ROUTES.WITHDRAW} element={<Withdraw />} />
              <Route
                path={ROUTES.TRANSACTION_DETAILS}
                element={<TransactionDetails />}
              />
              <Route path={ROUTES.ORDERS_HISTORY} element={<OrdersHistory />} />
              <Route
                path={ROUTES.LOTTERY_HISTORY}
                element={<LotteryHistory />}
              />
              <Route path={ROUTES.MY_ACCOUNT} element={<MyAccount />} />
              <Route
                path={ROUTES.CHANGE_PASSWORD}
                element={<ChangePassword />}
              />
              <Route
                path={ROUTES.FORGOT_PASSWORD}
                element={<ForgotPassword />}
              />
              <Route
                index
                element={<Navigate to={ROUTES.DASHBOARD} replace />}
              />
            </Route>

            {/* Catch all route */}
            <Route
              path="*"
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
          </Routes>
        </Router>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
