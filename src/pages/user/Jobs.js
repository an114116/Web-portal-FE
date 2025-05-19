import {
    DataTable,
    Grid,
    Theme,
    Button
} from "@carbon/react";
import { User, Search, Menu, Add } from "@carbon/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook điều hướng
import "@carbon/charts/styles.css";
import "./Jobs.css";

const headerData = [
    { header: "Job name", key: "job_name" },
    { header: "Start date", key: "start_date" },
    { header: "Duration", key: "duration" },
    { header: "Progress", key: "progress" },
    { header: "Status", key: "status" },
    { header: "Priority", key: "priority" },
    { header: "", key: "action" },
];

const rowData = [
    { id: "1", job_name: "Job_3", start_date: "12:37:35 12/12/2024", duration: "01:45:00", progress: "50%", status: "Running", priority: 3, action: " " },
    { id: "2", job_name: "Job_2", start_date: "09:07:23 11/12/2024", duration: "01:00:00", progress: "75%", status: "Failed", priority: 2, action: " " },
    { id: "3", job_name: "Job_1", start_date: "15:29:54 10/12/2024", duration: "00:20:00", progress: "100%", status: "Completed", priority: 1, action: " " },
];

const Jobs = () => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const navigate = useNavigate(); // Hook điều hướng

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
                            <li><button className="sidenav-item logout-btn" onClick={()=>navigate("/user/Home")}>🏠 Home</button></li>
                            <li><a href="#" className="sidenav-item active">📋 Jobs</a></li>
                            <li><button className="sidenav-item logout-btn" onClick={()=>navigate("/user/Performance")}>📊 Performance</button></li>
                            <li><button className="sidenav-item logout-btn" onClick={()=>navigate("/")}>🚪 Logout</button></li>
                        </ul>
                    )}
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {/* Custom Header */}
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

                    <div className="content-wrapper">
                        <h2>Jobs</h2>

                        {/* Workload Section */}
                        <div className="workload-section">
                            <div className="workload-header">
                                <h3>Workload</h3>
                                <Button className="create-job-btn" onClick={() => navigate("/user/Createjob")} renderIcon={Add}>
                                    Create job
                                </Button>
                            </div>

                            <DataTable
                                rows={rowData}
                                headers={headerData}
                                render={({ rows, headers, getHeaderProps }) => (
                                    <table className="bx--data-table">
                                        <thead>
                                            <tr>
                                                {headers.map((header) => (
                                                    <th key={header.key} {...getHeaderProps({ header })}>
                                                        {header.header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row) => (
                                                <tr key={row.id}>
                                                    {row.cells.map((cell) => (
                                                        <td key={cell.id}>{cell.value}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Theme>
    );
};

export default Jobs;
