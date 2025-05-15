import {
    DataTable,
    Grid,
    Theme,
} from "@carbon/react";

import { DonutChart } from "@carbon/charts-react";
import { User, Search, Menu } from "@carbon/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "@carbon/charts/styles.css";
import "./Home.css";

const headerData = [
    { header: "Job name", key: "job_name" },
    { header: "Start date", key: "start_date" },
    { header: "Duration", key: "duration" },
    { header: "Progress", key: "progress" },
    { header: "Status", key: "status" },
    { header: "Priority", key: "priority" },
];

const rowData = [
    { id: "1", job_name: "Job_3", start_date: "12:37:35 12/12/2024", duration: "01:45:00", progress: "50%", status: "Running", priority: 3 },
    { id: "2", job_name: "Job_2", start_date: "09:07:23 11/12/2024", duration: "01:00:00", progress: "75%", status: "Failed", priority: 2 },
    { id: "3", job_name: "Job_1", start_date: "15:29:54 10/12/2024", duration: "00:20:00", progress: "100%", status: "Completed", priority: 1 },
];

const pieChartData = [
    { group: "Running", value: 1 },
    { group: "Failed", value: 1 },
    { group: "Completed", value: 1 },
];

const Home = () => {
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
                        <ul>
                            <li><a href="#" className="sidenav-item active">🏠 Home</a></li>
                            <li><button className="sidenav-item logout-btn" onClick={()=>navigate("/user/Jobs")}>📋 Jobs</button></li>
                            <li><button className="sidenav-item logout-btn" onClick={()=>navigate("/user/Performance")}>📊 Performance</button></li>
                            <li><button className="sidenav-item logout-btn" onClick={()=>navigate("/")}>🚪 Logout</button></li>
                        </ul>
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
                        <h2>Home</h2>

                        {/* Workload Table */}
                        <div className="workload-section">
                            <h3>Workload</h3>
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

                        {/* Summary Section */}
                        <Grid className="summary-section">
                            {/* Workload Summary */}
                            <div className="summary-box">
                                <h3>Workload Summary</h3>
                                <DonutChart data={pieChartData} options={{ resizable: true }} />
                            </div>
                        </Grid>
                    </div>
                </div>
            </div>
        </Theme>
    );
};

export default Home;