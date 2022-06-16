import axios from "axios";

const http = axios.create({
    // baseURL: "https://mysterious-headland-43478.herokuapp.com/",
    baseURL: "http://localhost:4000/",
    headers: {
        "content-type": "application/json",
    },

})

export default http;

http.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers["Authorization"] = "Bearer " + accessToken;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

var retry = false;
http.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;
        let refreshToken = localStorage.getItem("Rtoken");
        if (
            refreshToken &&
            error.response.status === 403 &&
            !retry
        ) {
            retry = true;
            return http
                .post(`/api/user/refresh-token`, { token: refreshToken })
                .then((res) => {
                    if (res.status === 200) {
                        localStorage.setItem("token", res.data.result.accessToken);
                        console.log("Access token refreshed!");
                        retry = false;
                        return http(originalRequest);
                    }
                });
        }
        return Promise.reject(error);
    }
);
