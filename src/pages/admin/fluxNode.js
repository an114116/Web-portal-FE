import {
  DataTable,
  Theme,
  Button
} from "@carbon/react";
import { User, Search, Menu, Power } from "@carbon/icons-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@carbon/charts/styles.css";
import "./fluxNode.css";

const headerData = [
  { header: "Hostname", key: "flux_instance" },  
  { header: "Status", key: "status" },          
  { header: "Memory (GB)", key: "memory" },      
  { header: "Cores Available", key: "core" },   
  { header: "Free Nodes", key: "node_id" },     
  { header: "", key: "actions" },               
];

const FluxNode = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();

  const fetchNodeData = () => {
    fetch("http://10.1.8.28:8080/flux/nodes")
      .then((res) => res.json())
      .then((data) => {
        if (!data || !Array.isArray(data.nodes)) {
          console.error("Dữ liệu không hợp lệ:", data);
          return;
        }
  
        const formattedData = [];
  
        data.nodes.forEach((nodeObj, index) => {
          formattedData.push({
            id: index.toString(),
            flux_instance: nodeObj.hostname,
            status: nodeObj.status ?? "Unknown",
            memory: `${nodeObj.resource_info.cores.free}GB`,
            core: nodeObj.resource_info.cores.free ?? "N/A",
            node_id: nodeObj.resource_info.nodes.free ?? "N/A",
          });
        });
  
        setRowData(formattedData);
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu:", err));
  };
  
  useEffect(() => {
    fetchNodeData();
  }, []);

  const handleDrainNode = async (hostname, action) => {
    const url = `http://10.1.8.28:8080/flux/${action}`;
    const body = JSON.stringify({ hostname });

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} node`);
      }

      alert(`${action.charAt(0).toUpperCase() + action.slice(1)} node ${hostname} successfully.`);
      fetchNodeData(); // refresh node list
    } catch (error) {
      console.error(`Error ${action} node:`, error);
      alert(`Failed to ${action} node.`);
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
            <button className="menu-toggle" onClick={() => setIsNavOpen(!isNavOpen)}>
              <Menu size={20} />
            </button>
          </div>
            <ul>
              <li><button className="sidenav-item logout-btn" onClick={() => navigate("/admin/dashboard")}>🏠 Dashboard</button></li>
              <li><a href="#" className="sidenav-item active">📊 Flux Node</a></li>
              <li><button className="sidenav-item logout-btn" onClick={() => navigate("/admin/Jobs")}>📋 Jobs</button></li>
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

          <div className="content-wrapper">
            <h2>Flux Node</h2>

            {/* Workload Section */}
            <div className="workload-section">
              <div className="workload-header">
                <h3>Node Status</h3>
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
                          <td>
                            <Button
                              size="sm"
                              className={`control-node ${
                                row.cells.find(c => c.info.header === 'status').value === "avail"
                                  ? "btn-off"
                                  : "btn-on"
                              }`}
                              renderIcon={Power}
                              onClick={() => {
                                const status = row.cells.find(c => c.info.header === 'status').value;
                                const hostname = row.cells.find(c => c.info.header === 'flux_instance').value;
                                const action = status === "avail" ? "drain" : "undrain";
                                handleDrainNode(hostname, action);
                              }}
                            >
                              {row.cells.find(c => c.info.header === 'status').value === "avail" ? "OFF" : "ON"}
                            </Button>
                          </td>
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

export default FluxNode;
