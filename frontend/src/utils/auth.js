// utils/auth.js
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const isAdmin = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.isAdmin;
};
