import { useContext, useEffect } from "react";
import "./App.css";

import { Layout, Menu, notification } from "antd";

import { Link, Navigate, useRoutes } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Quiz from "./components/Quiz";
import QuizCreator from "./components/QuizCreator";
import QuizList from "./components/QuizList";
import Register from "./components/Register";

import { UserContext } from "./context/userContext";
import UserService from "./service/userService";

const { Header, Content } = Layout;

const routes = (isLoggedIn) => [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
  },
  {
    path: "/register",
    element: !isLoggedIn ? <Register /> : <Navigate to="/" />,
  },
  {
    path: "/quiz/create",
    element: isLoggedIn ? <QuizCreator /> : <Navigate to="/login" />,
  },
  {
    path: "/quiz/list",
    element: isLoggedIn ? <QuizList /> : <Navigate to="/login" />,
  },
  {
    path: "/quiz/:id",
    element: <Quiz />,
  },
];

function App() {
  const { user, updateUser } = useContext(UserContext);
  const routing = useRoutes(routes(user));

  useEffect(() => {
    window.addEventListener("storage", function (e) {
      updateUser();
    });
  }, []);

  const loggedIn = [
    { label: <Link to="/quiz/create">Create Quiz</Link>, key: "1" },
    { label: <Link to="/quiz/list">Quiz List</Link>, key: "2" },
    {
      label: (
        <Link onClick={logout} to="/">
          Logout
        </Link>
      ),
      key: "3",
    },
  ];
  const loggedOut = [
    { label: <Link to="/register">Register</Link>, key: "1" },
    { label: <Link to="/login">Login</Link>, key: "2" },
  ];

  function logout() {
    UserService.logout(localStorage.getItem("Rtoken")).then((result) => {
      localStorage.clear();
      updateUser();
      notification.open({
        type: "success",
        message: "Logged out Successfull!",
      });
    });
  }

  return (
    <Layout className="my-layout">
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <Link to={"/"}>
          <div
            style={{
              width: "120px",
              float: "left",
              color: "white",
              fontSize: "20px",
            }}
          >
            Quiz Engine
          </div>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ justifyContent: "flex-end" }}
          selectable={false}
          items={user && user.userId ? loggedIn : loggedOut}
        ></Menu>
      </Header>
      <Content
        style={{
          marginTop: 75,
        }}
      >
        {routing}
      </Content>
    </Layout>
  );
}

export default App;
