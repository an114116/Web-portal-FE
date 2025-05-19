import {
    DataTable,
    Theme,
    Button,
    Pagination,
    Grid
} from "@carbon/react";
import { DonutChart } from "@carbon/charts-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Search, Menu, Add } from "@carbon/icons-react";
import { parse } from "lossless-json";
import "@carbon/charts/styles.css";
import "./dashboard.css";

const jobTableHeaders = [
    { key: "id", header: "Job ID" },
    { key: "name", header: "Name" },
    { key: "username", header: "User" },
    { key: "nnodes", header: "Nodes" },
    { key: "ntasks", header: "Tasks" },
    { key: "ncores", header: "Cores" },
    { key: "nodelist", header: "Node List" },
    { key: "t_submit", header: "Submit Time" },
    { key: "runtime", header: "Runtime (s)" },
    { key: "state", header: "State" },
    { key: "status", header: "Status" },
];

const Dashboard = () => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [nodeSummary, setNodeSummary] = useState([]);
    const [jobData, setJobData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 3;
    const navigate = useNavigate();

    const userTableHeaders = [
        { header: "Role", key: "role" },
        { header: "Count", key: "count" },
    ];    

    const userTableData = [
        { id: "1", role: "User", count: 1 },
        { id: "2", role: "Administrator", count: 1 },
    ];

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const res = await fetch("http://10.1.8.28:8080/flux/nodes");
                const data = await res.json();
    
                if (!data || !Array.isArray(data.nodes)) {
                    console.error("Invalid node data:", data);
                    return;
                }
    
                let availCount = 0;
                let drainedCount = 0;
    
                data.nodes.forEach((node) => {
                    if (node.status === "avail") availCount++;
                    else drainedCount++;
                });
    
                const nodeStatusSummary = [
                    {
                        id: "avail",
                        group: "avail",
                        value: availCount,
                      },
                      {
                        id: "drained",
                        group: "drained",
                        value: drainedCount,
                      }
                ];
    
                setNodeSummary(nodeStatusSummary);
            } catch (error) {
                console.error("Error fetching node data:", error);
            }
        };

        const fetchJobs = async () => {
            try {
                const res = await fetch("http://10.1.8.28:8080/flux/jobs");
                const rawText = await res.text();
                const data = parse(rawText);

                if (!data || !Array.isArray(data.jobs)) {
                    console.error("Invalid job data:", data);
                    return;
                }

                const jobs = data.jobs.map(job => ({
                    id: job.id.toString(),
                    name: job.name,
                    username: job.username,
                    nnodes: Number(job.nnodes),
                    ntasks: Number(job.ntasks),
                    ncores: Number(job.ncores),
                    nodelist: job.nodelist ? job.nodelist : 'None',
                    t_submit: formatTimestamp(Number(job.t_submit)),
                    runtime: job.runtime ? Number(job.runtime).toFixed(2) : '0',
                    state: job.state,
                    status: job.status,
                }));

                setJobData(jobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        
        fetchNodes();
        fetchJobs();
    }, []);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    };

    const paginatedData = jobData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

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
                    <ul>
                        <li><a href="#" className="sidenav-item active">🏠 Dashboard</a></li>
                        <li><button className="sidenav-item logout-btn" onClick={() => navigate("/admin/fluxNode")}>📊 Flux Node</button></li>
                        <li><button className="sidenav-item logout-btn" onClick={() => navigate("/admin/jobs")}>📋 Jobs</button></li>
                        <li><button className="sidenav-item logout-btn" onClick={() => navigate("/admin/fileManage")}>📂 File</button></li>
                        <li><button className="sidenav-item logout-btn" onClick={handleLogout}>🚪 Logout</button></li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="main-content">
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
                        <h2>Dashboard</h2>

                        {/* Jobs Table */}
                        <div className="workload-section">
                            <div className="workload-header">
                                <h3>Workload</h3>
                            </div>
                            <DataTable
                                rows={paginatedData}
                                headers={jobTableHeaders}
                                render={({ rows, headers, getHeaderProps }) => (
                                    <>
                                        <div className="table-container">
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
                                            <div className="horizontal-pagination">
                                                <Pagination
                                                    backwardText=""
                                                    forwardText=""
                                                    page={currentPage}
                                                    pageSize={rowsPerPage}
                                                    pageSizes={[rowsPerPage]}
                                                    totalItems={jobData.length}
                                                    onChange={({ page }) => setCurrentPage(page)}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            />
                        </div>
                        <Grid className="summary-section">
                            {/* User Summary */}
                            <div className="summary-box">
                                <h3 style={{ textAlign: "center" }}>User</h3>
                                <h1 style={{ textAlign: "center" }}>2</h1>
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

                            {/* Node Summary */}
                            <div className="summary-box">
                                <h3>Node Summary</h3>
                                <DonutChart
                                    data={nodeSummary}
                                    // className={"donut-chart-container"}
                                    options={{
                                        resizable: true,
                                        donut: {
                                            centerLabel: `${nodeSummary.reduce((sum, n) => sum + n.value, 0)} Nodes`,
                                            alignment: 'center'
                                        }
                                    }}
                                />
                                <DataTable
                                    rows={nodeSummary}
                                    headers={[
                                        { header: "Status", key: "group" },
                                        { header: "Count", key: "value" },
                                    ]}
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

export default Dashboard;