// import React, { createContext, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export const AppContext = createContext();

// const AppContextProvider = (props) => {
//   const [user, setuser] = useState(null);
//   const [showLogin, setShowLogin] = useState(false);
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [credit, setcredit] = useState(false);

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const navigate = useNavigate();

//   const loadCreditData = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + "/api/user/credits", {
//         headers: { token },
//       });

//       if (data.success) {
//         setcredit(data.credit);
//         setuser(data.user);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   const generateImage = async (prompt) => {
//     try {
//       const { data } = await axios.post(
//         backendUrl + "/api/image/generate-image",
//         { prompt },
//         { headers: { token } }
//       );
//       if (data.success) {
//         loadCreditData();
//         return data.resultImage;
//       } else {
//         toast.error(data.message);
//         loadCreditData();
//         if (data.creditBalance === 0) {
//           navigate("/buy");
//         }
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken("");
//     setuser(null);
//   };

//   useEffect(() => {
//     if (token) {
//       loadCreditData();
//     }
//   }, [token]);

//   const value = {
//     user,
//     setuser,
//     showLogin,
//     setShowLogin,
//     backendUrl,
//     token,
//     setToken,
//     credit,
//     setcredit,
//     loadCreditData,
//     logout,
//     generateImage,
//   };

//   return (
//     <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
//   );
// };
// export default AppContextProvider;

import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setuser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setcredit] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  /* ---------------- LOAD CREDIT DATA ---------------- */
  const loadCreditData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/credits", {
        headers: { token },
      });

      if (data.success) {
        setcredit(data.credit);
        setuser(data.user);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load credit data");
    }
  };

  /* ---------------- SIGNUP ---------------- */
  const signup = async (name, email, password) => {
    if (authLoading) return;

    setAuthLoading(true);

    try {
      const { data } = await axios.post(backendUrl + "/api/user/signup", {
        name,
        email,
        password,
      });

      if (data.success) {
        toast.success(data.message);

        localStorage.setItem("token", data.token);
        setToken(data.token);
        setuser(data.user);

        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setAuthLoading(false);
    }
  };

  /* ---------------- LOGIN ---------------- */
  const login = async (email, password) => {
    if (authLoading) return;

    setAuthLoading(true);

    try {
      const { data } = await axios.post(backendUrl + "/api/user/login", {
        email,
        password,
      });

      if (data.success) {
        toast.success("Login successful");

        localStorage.setItem("token", data.token);
        setToken(data.token);
        setuser(data.user);

        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  };

  /* ---------------- GENERATE IMAGE ---------------- */
  const generateImage = async (prompt) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/generate-image",
        { prompt },
        { headers: { token } }
      );

      if (data.success) {
        loadCreditData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        loadCreditData();
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      toast.error("Image generation failed");
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setuser(null);
    navigate("/");
  };

  /* ---------------- AUTO LOAD USER ---------------- */
  useEffect(() => {
    if (token) {
      loadCreditData();
    }
  }, [token]);

  /* ---------------- CONTEXT VALUE ---------------- */
  const value = {
    user,
    setuser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setcredit,
    loadCreditData,
    signup,
    login,
    authLoading,
    logout,
    generateImage,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
