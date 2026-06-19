import api from "./api";


export const register = (name: string, email: string, password: string) => {
  return api.post("/auth/register", {
    name,
    email,
    password,
  }).then(res => res.data);
};

export const login = async (email: string, password: string) => {
  console.log("LOGIN CALLED WITH:", email, password);

  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};