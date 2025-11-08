export const setAuthToken = (token:string) => {
 localStorage.setItem("token", token);
};

export const getAuthToken = () => {
 return localStorage.getItem("token");
};

export const deleteToken = () => { 
 localStorage.removeItem("token");
 
};