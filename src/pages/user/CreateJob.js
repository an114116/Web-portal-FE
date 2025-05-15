import {
    Button,
    NumberInput,
    TextInput,
    Select,
    SelectItem,
    FileUploaderButton,
    Theme
  } from "@carbon/react";
  import { Menu, Search, User } from "@carbon/icons-react";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import "./CreateJob.css";
  
  const CreateJob = () => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const navigate = useNavigate();
  
    return (
      <Theme theme="g10">
        <div className="dashboard-container">
          {/* Sidebar */}
          <div className={`custom-sidenav ${isNavOpen ? "open" : "closed"}`}>
            <div className="sidenav-header">
              {isNavOpen && <span className="sidenav-title">HPC-QC ResMan</span>}
              <button className="menu-toggle" onClick={() => setIsNavOpen(!isNavOpen)}>
                <Menu size={20} />
              </button>
            </div>
            {isNavOpen && (
              <ul>
                <li><button className="sidenav-item logout-btn" onClick={() => navigate("/user/Home")}>🏠 Home</button></li>
                <li><button className="sidenav-item logout-btn active" onClick={() => navigate("/user/Jobs")}>📋 Jobs</button></li>
                <li><button className="sidenav-item logout-btn" onClick={() => navigate("/user/Performance")}>📊 Performance</button></li>
                <li><button className="sidenav-item logout-btn" onClick={() => navigate("/")}>🚪 Logout</button></li>
              </ul>
            )}
          </div>
  
          {/* Main Content */}
          <div className="main-content">
            {/* Header */}
            <div className="custom-header">
              <div className="search-container">
                <Search className="search-icon" />
                <input type="text" placeholder="Search" className="search-input" />
              </div>
              <div className="user-section">
                <User className="user-icon" />
                <span>User</span>
              </div>
            </div>
  
            {/* Content */}
            <main className="content-wrapper">
              <h2>Create Job</h2>
  
              <div className="form-card">
              <form>
                <div className="job-form-grid-2col">

                    {/* Job Name & Duration */}
                    <TextInput id="jobName" labelText="Job Name" placeholder="Job name" required />
                    <TextInput id="duration" labelText="Time Duration" placeholder="hh:mm:ss" type="time" required />

                    {/* Priority as dropdown (Select from Carbon) */}
                    <Select id="priority" labelText="Priority" defaultValue="">
                        <SelectItem value="" text="Select Priority" />
                        <SelectItem value="low" text="Low" />
                        <SelectItem value="medium" text="Medium" />
                        <SelectItem value="high" text="High" />
                    </Select>

                    {/* Custom Date Picker */}
                    <div className="custom-datepicker">
                    <label htmlFor="startDate" style={{ marginBottom: "0.5rem", display: "block" }}>Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="custom-date-input"
                        required
                    />
                    </div>

                    {/* Number Inputs with horizontal +/- */}
                    <NumberInput
                    id="memory"
                    label="Total Memory (GB)"
                    min={1}
                    step={1}
                    allowEmpty={false}
                    />
                    <NumberInput
                    id="cores"
                    label="Number of Cores"
                    min={1}
                    step={1}
                    allowEmpty={false}
                    />

                    {/* Upload Requirements */}
                    <div className="file-upload-group">
                    <label htmlFor="requirements">Upload Requirements (.txt)</label>
                    <FileUploaderButton
                        buttonLabel="Browse"
                        accept={[".txt"]}
                        id="requirements"
                        labelText=""
                        multiple={false}
                    />
                    </div>

                    {/* Upload Script Files */}
                    <div className="file-upload-group">
                    <label htmlFor="scripts">Upload Script Files (.sh, .py)</label>
                    <FileUploaderButton
                        buttonLabel="Browse"
                        accept={[".sh", ".py"]}
                        id="scripts"
                        labelText=""
                        multiple
                    />
                    </div>

                    {/* Command Input */}
                    <div className="file-upload-group">
                    <label>Command</label>
                    <TextInput id="cmd1" labelText="Command #1" placeholder="e.g. bash" />
                    <TextInput id="cmd2" labelText="Command #2" placeholder="e.g. mainScript.sh" />
                    </div>

                    {/* Upload Data Files */}
                    <div className="file-upload-group">
                    <label htmlFor="data">Upload Data Files (.csv, .json)</label>
                    <FileUploaderButton
                        buttonLabel="Browse"
                        accept={[".csv", ".json"]}
                        id="data"
                        labelText=""
                        multiple
                    />
                    </div>

                </div>

                <div className="form-buttons">
                    <Button kind="secondary" onClick={() => navigate("/user/Jobs")}>Cancel</Button>
                    <Button kind="primary" type="submit">Create</Button>
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