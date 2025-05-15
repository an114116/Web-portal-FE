import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/dashboard";
import Jobs from "./pages/admin/Jobs";
import Node from "./pages/admin/fluxNode"
import CreateJob from "./pages/admin/CreateJob";
// import Account from "./pages/admin/account";
import FileManage from "./pages/admin/fileManage";
import Home from "./pages/user/Home";
import UserPerformance from "./pages/user/Performance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/Jobs" element={<Jobs/>}/>
        <Route path="/admin/fluxNode" element={<Node/>}/>
        <Route path="/admin/Createjob" element={<CreateJob />} />
        <Route path="/admin/fileManage" element={<FileManage/>} />
        {/* <Route path="/admin/account" element={<Account />} /> */}
        <Route path="/user/home" element={<Home />} />
        <Route path="/user/Performance" element={<UserPerformance/>}/>
      </Routes>
    </Router>
  );
}

export default App;