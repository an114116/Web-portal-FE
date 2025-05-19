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
import "./account.css";

const headerData = [
    { header: "Username", key: "username" },
    { header: "Role", key: "role" },
    { header: "Password", key: "password" },
    { header: "", key: "action" },
];

const rowData = [
    { username: "user", role: "User", password: "user", action: ""},
    { username: "admin", role: "Adminstrator", password: "admin", action: ""},
];


const Account = () => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const navigate = useNavigate();

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
                        <button className="menu-toggle" onClick={() => setIsNavOpen(!isNavOpen)}>
                            <Menu size={20} />
                        </button>
                    </div>
                    {isNavOpen && (
                        <ul>
                            <li><button className="sidenav-item logout-btn" onClick={()=>navigate("/admin/dashboard")}>🏠 Dashboard</button></li>
                            <li><button className="sidenav-item logout-btn" onClick={()=>navigate("/admin/fluxNode")}>📊 Flux Node</button></li>
                            <li><button className="sidenav-item logout-btn" onClick={()=>navigate("/admin/Jobs")}>📋 Jobs</button></li>
                            <li><a href="#" className="sidenav-item active">📋 Account</a></li>
                            <li><button className="sidenav-item logout-btn" onClick={handleLogout}>🚪 Logout</button></li>
                        </ul>
                    )}
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {/* Custom Header */}
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

                    <div className="content-wrapper">
                        <h2>Jobs</h2>

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
                    </div>
                </div>
            </div>
        </Theme>
    );
};

export default Account;