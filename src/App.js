import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/dashboard";
import Jobs from "./pages/admin/Jobs";
import Node from "./pages/admin/fluxNode";
import CreateJob from "./pages/admin/CreateJob";
// import Account from "./pages/admin/account";
import FileManage from "./pages/admin/fileManage";
import Home from "./pages/user/Home";
import UserPerformance from "./pages/user/Performance";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/Jobs"
          element={
            <PrivateRoute>
              <Jobs />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/fluxNode"
          element={
            <PrivateRoute>
              <Node />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/Createjob"
          element={
            <PrivateRoute>
              <CreateJob />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/fileManage"
          element={
            <PrivateRoute>
              <FileManage />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/Performance"
          element={
            <PrivateRoute>
              <UserPerformance />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
