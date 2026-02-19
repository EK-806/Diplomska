import axios from "axios";

const axiosApiCall = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosApiCall.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((cb) => cb(newAccessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb) => refreshSubscribers.push(cb);

axiosApiCall.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) return Promise.reject(error);

    const originalRequest = error.config;

    if (
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const updateToken =
        localStorage.getItem("updateToken") ||
        localStorage.getItem("refreshToken");

      if (!updateToken) {
        localStorage.clear();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await axiosApiCall.post("/api/v1/user/update-token", {
            updateToken,
          });

          if (!data?.accessToken) {
            isRefreshing = false;
            localStorage.clear();
            return Promise.reject(
              new Error("Backend did not return accessToken on refresh.")
            );
          }

          localStorage.setItem("accessToken", data.accessToken);

          if (data.updateToken) localStorage.setItem("updateToken", data.updateToken);
          if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

          isRefreshing = false;
          onRefreshed(data.accessToken);
        } catch (err) {
          isRefreshing = false;
          localStorage.clear();
          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosApiCall(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosApiCall;