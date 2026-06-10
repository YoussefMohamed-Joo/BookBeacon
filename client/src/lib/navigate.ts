import { NavigateFunction } from 'react-router-dom';

let navigate: NavigateFunction | null = null;

export const setNavigate = (fn: NavigateFunction) => { navigate = fn; };

export const redirectToLogin = () => {
  localStorage.removeItem('user');
  if (navigate) navigate('/login');
  else window.location.href = '/login';
};
