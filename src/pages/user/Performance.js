import {
    DataTable,
    Grid,
    Theme,
} from "@carbon/react";

import { ProgressBar } from "@carbon/react";
import { DonutChart } from "@carbon/charts-react";
import { User, Search, Menu } from "@carbon/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@carbon/charts/styles.css";
import "./Performance.css";

const userTableHeaders = [
    { header: "Node", key: "node" },
    { header: "Job", key: "job" },
    { header: "%", key: "percent"}
];

const userTableData = [
    { id: "1", node: "Node 1", job: 1, percent: 100},
];

const CPUData = [
    { group: "Usage", value: 66 },
    { group: "Remaining", value: 22 },
];

const StorageData = [
    { group: "Usage", value: 4.78 },
    { group: "Remaining", value: 1.59 },
];

const RAMData = [
    { group: "Usage", value: 119.89 },
    { group: "Remaining", value: 39.96 },
];

const Performance = () => {
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
                            <li><button className="sidenav-item logout-btn" onClick={()=>navigate("/user/Home")}>🏠 Home</button></li>
                            <li><button className="sidenav-item logout-btn" onClick={()=>navigate("/user/Jobs")}>📋 Jobs</button></li>
                            <li><a href="#" className="sidenav-item active">📊 Performance</a></li>
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
                        <h2>Performance</h2>

                        {/* Summary Section */}
                        <Grid className="summary-section">
                            {/* Node Summary (Table Format) */}
                            <div className="summary-box">
                                <h3>RAM Usage</h3>
                                <DonutChart
                                    data={RAMData}
                                    options={{
                                        resizable: true,
                                        donut: { centerLabel: "75%" },
                                    }}
                                />
                            </div>
                            <div className="summary-box">
                                <h3>CPUs Usage</h3>
                                <DonutChart
                                    data={CPUData}
                                    options={{
                                        resizable: true,
                                        donut: { centerLabel: "4 Nodes" },
                                    }}
                                />
                            </div>
                            <div className="summary-box">
                                <h3>Storage Usage</h3>
                                <DonutChart
                                    data={StorageData}
                                    options={{
                                        resizable: true,
                                        donut: { centerLabel: "4 Nodes" },
                                    }}
                                />
                            </div>
                            {/* User Summary (Table Format) */}
                            <div className="summary-box">
                                <h3 style={{textAlign:"center"}}>Running Tasks</h3>
                                <h1 style={{textAlign:"center"}}>1</h1>
                                <DataTable
                                    rows={userTableData}
                                    headers={userTableHeaders}
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
                        </Grid>
                    </div>
                </div>
            </div>
        </Theme>
    );
};

export default Performance;