import React, { lazy, Suspense } from "react";
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

import { ROUTES } from "@/config/constants";

// Pages (lazy-loaded)
const AdminLayout = lazy(() => import("@/components/common/AdminLayout"));
const PrivateRoute = lazy(() => import("@/components/common/PrivateRoute"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const Login = lazy(() => import("@/pages/user/Login"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const UserManagement = lazy(() => import("@/pages/admin/UserManagement"));
const UserDashboard = lazy(() => import("@/pages/user/UserDashboard"));
const Profile = lazy(() => import("@/pages/user/Profile"));
import { AuthProvider } from "@/contexts/AuthContext";
const UserLayout = lazy(() => import("@/components/common/UserLayout"));
const BankTransfer = lazy(() => import("@/pages/user/BankTransfer"));
const GameDaiPhat = lazy(() => import("@/pages/user/components/GameDaiPhat"));
const DepositManagement = lazy(() => import("@/pages/admin/DepositManagement"));
const HistoryDepositManagement = lazy(() => import("@/pages/admin/HistoryDepositManagement"));
const OrderManagement = lazy(() => import("@/pages/admin/OrderManagement"));
const HistoryOrderManagement = lazy(() => import("@/pages/admin/HistoryOrderManagement"));
const BankManagement = lazy(() => import("@/pages/admin/BankManagement"));
const PromotionManagement = lazy(() => import("@/pages/admin/PromotionManagement"));
const CustomerService = lazy(() => import("@/pages/user/CustomerService"));
const Promotion = lazy(() => import("@/pages/user/Promotion"));
const Bank = lazy(() => import("@/pages/user/components/Bank"));
const AddBank = lazy(() => import("@/pages/user/components/AddBank"));
const Withdraw = lazy(() => import("@/pages/user/components/Withdraw"));
const TransactionDetails = lazy(() => import("@/pages/user/components/TransactionDetails"));
const OrdersHistory = lazy(() => import("@/pages/user/components/OrdersHistory"));
const MyAccount = lazy(() => import("@/pages/user/components/MyAccount"));
const ChangePassword = lazy(() => import("@/pages/user/components/ChangePassword"));
const LotteryHistory = lazy(() => import("@/pages/user/components/LotteryHistory"));
const HistorySessionManagement = lazy(() => import("@/pages/admin/HistorySessionManagement"));
const ForgotPassword = lazy(() => import("@/pages/user/components/ForgotPassword"));
const RoomManagement = lazy(() => import("@/pages/admin/RoomManagement"));

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
        <Suspense fallback={<div />}> 
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
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
