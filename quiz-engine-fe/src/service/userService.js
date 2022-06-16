import http from "../http-common";

const UserService = {
  signup(data) {
    return http.post("/api/user/signup", data);
  },

  signin(data) {
    return http.post("/api/user/signin", data);
  },

  logout(token) {
    return http.post("/api/user/logout", { token });
  },
};

export default UserService;
