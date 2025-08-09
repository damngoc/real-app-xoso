import { jwtDecode } from 'jwt-decode';

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('adminToken', token);
  } else {
    localStorage.removeItem('adminToken');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('adminToken');
};
export const setUserToken = (token) => {
  if (token) {
    localStorage.setItem('userToken', token);
  } else {
    localStorage.removeItem('userToken');
  }
};

export const getUserToken = () => {
  return localStorage.getItem('userToken');
};

export const removeUserToken = () => {
  localStorage.removeItem('userToken');
};

export const setUserStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUserStorage = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const removeUserStorage = () => {
  localStorage.removeItem('user');
};

export const setCurrentRole = (role) => {
  localStorage.setItem('currentRole', role);
};
export const removeCurrentRole = () => {
  localStorage.removeItem('currentRole');
};

export const getUserFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      removeAuthToken();
      return null;
    }
    return {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      removeAuthToken();
      removeUserToken();
      return null;
    }
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      removeAuthToken();
      removeUserToken();
      return true;
    }
    return true;
  }
};
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  return !isTokenExpired(token);
};

export const logoutUser = () => {
  removeUserToken();
  removeUserStorage();
  removeCurrentRole();
  window.location.href = '/login';
}