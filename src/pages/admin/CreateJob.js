import {
  Button,
  NumberInput,
  TextInput,
  Theme
} from "@carbon/react";
import { Menu, Search, User } from "@carbon/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateJob.css";

const CreateJob = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [jobName, setJobName] = useState("");
  const [jobCommand, setJobCommand] = useState("");
  const [dirName, setDirName] = useState("");
  const [nodes, setNodes] = useState(1);
  const [cores, setCores] = useState(0);
  const [tasksPerNode, setTasksPerNode] = useState(0);
  const [tasksPerCore, setTasksPerCore] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobName || !jobCommand) {
      alert("Please fill in all required fields.");
      return;
    }
    if (tasksPerNode > 0 && tasksPerCore > 0) {
      alert("Please enter only one of 'Tasks per Node' or 'Tasks per Core'.");
      return;
    }

    const endpoint = "http://10.1.8.28:8080/flux/jobs";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jobName,
        jobCommand,
        dirName,
        options: {
          nodes,
          cores,
          "tasks-per-node": tasksPerNode,
          "tasks-per-core": tasksPerCore
        }
      })
    };
  
    try {
      const response = await fetch(endpoint, options);
  
      if (response.ok) {
        alert("Job created successfully!");
        navigate("/admin/Jobs");
      } else {
        const errText = await response.text();
        alert("Failed to create job: " + errText);
      }
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Error sending request: " + error.message);
    }
  };  

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <Theme theme="g10">
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className={`custom-sidenav ${isNavOpen ? "open" : "closed"}`}>
          <div className="sidenav-header">
            {isNavOpen && <span className="sidenav-title">HPC-QC ResMan</span>}
            <button
              className="menu-toggle"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
          <ul>
            <li><button className="sidenav-item logout-btn" onClick={() => navigate("/admin/dashboard")}>🏠 Dashboard</button></li>
            <li><button className="sidenav-item logout-btn" onClick={() => navigate("/admin/fluxNode")}>📊 Flux Node</button></li>
            <li><a href="#" className="sidenav-item active">📋 Jobs</a></li>
            <li><button className="sidenav-item logout-btn" onClick={() => navigate("/admin/fileManage")}>📂 File</button></li>
            <li><button className="sidenav-item logout-btn" onClick={handleLogout}>🚪 Logout</button></li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <div className="custom-header">
            {/* <div className="search-container">
              <Search className="search-icon" />
              <input type="text" placeholder="Search" className="search-input" />
            </div> */}
            <div className="user-section">
              <User className="user-icon" />
              <span>Admin</span>
            </div>
          </div>

          {/* Content */}
          <main className="content-wrapper">
            <h2>Create Job</h2>

            <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="job-form-grid-2col">
                <TextInput
                  id="jobName"
                  labelText="Job Name"
                  placeholder="Enter job name"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                />
                <TextInput
                  id="jobCommand"
                  labelText="Job Command"
                  placeholder="Enter job command"
                  value={jobCommand}
                  onChange={(e) => setJobCommand(e.target.value)}
                />
                <TextInput
                  id="dirName"
                  labelText="Directory Name"
                  placeholder="Enter directory name"
                  value={dirName}
                  onChange={(e) => setDirName(e.target.value)}
                />
                
                {/* Options */}
                <div className="job-options">
                <NumberInput
                  id="nodes"
                  label="Number of Nodes"
                  value={nodes}
                  onChange={(e) => setNodes(e.target.value)}
                  hideSteppers={true}
                />

                <NumberInput
                  id="cores"
                  label="Cores per Node"
                  value={cores}
                  onChange={(e) => setCores(e.target.value)}
                  hideSteppers={true}
                />

                <NumberInput
                  id="tasks-per-node"
                  label="Tasks per Node"
                  value={tasksPerNode}
                  min={0}
                  onChange={(e, { value }) => {
                    const val = Number(value);
                    setTasksPerNode(val);
                    if (val > 0) setTasksPerCore(0);
                  }}
                  disabled={tasksPerCore > 0}
                  hideSteppers={true}
                />

                <NumberInput
                  id="tasks-per-core"
                  label="Tasks per Core"
                  value={tasksPerCore}
                  min={0}
                  onChange={(e, { value }) => {
                    const val = Number(value);
                    setTasksPerCore(val);
                    if (val > 0) setTasksPerNode(0);
                  }}
                  disabled={tasksPerNode > 0}
                  hideSteppers={true}
                />

                </div>
              </div>

              <div className="form-buttons">
                <Button kind="secondary" onClick={() => navigate("/admin/Jobs")}>
                  Cancel
                </Button>
                <Button kind="primary" type="submit">
                  Create
                </Button>
              </div>
            </form>
            </div>
          </main>
        </div>
      </div>
    </Theme>
  );
};

export default CreateJob;
