import React, { useEffect, useState } from "react";
import { Theme, Button } from "@carbon/react";
import { Menu, Search, User, Upload, TrashCan} from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";
import "./fileManage.css";

const FileManage = () => {
    const [isNavOpen, setIsNavOpen] = useState(true);
    const [parsedTree, setParsedTree] = useState([]);
    const [selectedDir, setSelectedDir] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);  // Mới thêm
    const [folderName, setFolderName] = useState("");  // Tên folder được nhập
    const [selectedFiles, setSelectedFiles] = useState(null); // Các file đã chọn
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://10.1.8.28:8080/flux/tree?dirName=")
        .then((res) => res.text())
        .then((text) => {
            const lines = text.split("\n");
            const structured = parseTreeLines(lines);
            setParsedTree(structured);
        })
        .catch((err) => console.error("Error fetching tree:", err));
    }, []);

    const parseTreeLines = (lines) => {
        const rootLine = lines.find(line => line.trim());
        if (!rootLine) return [];

        const rootMatch = rootLine.match(/^\[(?<size>.*?)\] (?<name>.+)$/);
        if (!rootMatch) return [];

        const root = {
            name: rootMatch.groups.name,
            size: rootMatch.groups.size,
            type: "folder",
            children: [],
            level: -1,
        };

        const stack = [root];

        lines.slice(1).forEach((line) => {
            if (!line.trim()) return;

            const match = line.match(/^(?<indent>.*?)(├──|└──)? ?\[(?<size>.*?)\] (?<name>.+)$/);
            if (!match) return;

            const { indent, size, name } = match.groups;

            const level = (indent.match(/│|    /g) || []).length;

            const isZip = name.endsWith(".zip");
            const isDir = !name.includes(".") || name.endsWith("/");

            const node = {
                name,
                size,
                type: isDir ? "folder" : isZip ? "zip" : "file",
                children: [],
                level,
            };

            while (stack.length && stack[stack.length - 1].level >= level) {
                stack.pop();
            }

            const parent = stack[stack.length - 1];
            parent.children.push(node);
            stack.push(node);
        });

        return [root];
    };

    const renderTree = (nodes, level = 0) =>
        nodes.map((node, index) => {
            const isSelected = node.type === "folder" && node.name === selectedDir;

            return (
                <div key={`${node.name}-${index}`} className="file-node">
                    <div
                        className={`file-row ${isSelected ? "selected-folder" : ""}`}
                        style={{ paddingLeft: `${level * 20}px`, cursor: node.type === "folder" ? "pointer" : "default" }}
                        onClick={() => {
                            if (node.type === "folder") {
                                setSelectedDir(node.name);
                                setFolderName(node.name);
                            }
                        }}
                    >
                        <span className="file-icon">
                            {node.type === "folder" ? "📁" : node.type === "zip" ? "📦" : "📄"}
                        </span>
                        <span className="file-name">{node.name}</span>
                        <span className="file-size">({formatSize(node.size)})</span>
                    </div>
                    {node.children && node.children.length > 0 && (
                        <div className="file-children">
                            {renderTree(node.children, level + 1)}
                        </div>
                    )}
                </div>
            );
    });

    const formatSize = (sizeStr) => {
        const b = parseFloat(sizeStr);
        if (isNaN(b)) return sizeStr;
        if (b < 1024) return `${b} B`;
        if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
        return `${(b / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleDeleteFolder = async () => {
        const confirm = window.confirm(`Are you sure you want to delete "${selectedDir}"?`);
        if (!confirm) return;
        const dirName = selectedDir.trim();

        try {
            const response = await fetch(`http://10.1.8.28:8080/flux/files?dirName=${encodeURIComponent(dirName)}`, {
            method: "DELETE",
            });

            const result = await response.text();
            if (response.ok) {
                alert("Folder deleted successfully!");
                setSelectedDir(null);
                window.location.reload();
            } else {
            alert(`Failed to delete folder: ${result}`);
            }
        } catch (err) {
            console.error("Delete failed:", err);
            alert("An error occurred while deleting the folder.");
        }
        };

    const handleFileUpload = async () => {
        const dirName = folderName.trim() || "";

        if (!selectedFiles || !dirName) {
            alert("Please select files and enter a folder name.");
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append("files", selectedFiles[i]);
        }

        try {
            const res = await fetch(`http://10.1.8.28:8080/flux/files?dirName=${dirName}`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Upload failed");
            }

            alert("Upload successful!");
            setIsModalOpen(false);
            window.location.reload();
        } catch (err) {
            console.error("Upload error:", err);
            alert(`Upload failed: ${err.message}`);
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
                        <li><button className="sidenav-item logout-btn" onClick={() => navigate("/admin/fluxNode")}>📊 Flux Node</button></li>
                        <li><button className="sidenav-item logout-btn" onClick={() => navigate("/admin/Jobs")}>📋 Jobs</button></li>
                        <li><a href="#" className="sidenav-item active">📂 File</a></li>
                        <li><button className="sidenav-item logout-btn" onClick={handleLogout}>🚪 Logout</button></li>
                    </ul>
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
                        <div className="workload-header">
                            <h2>📂 File Explorer</h2>
                            <div className="button-field">
                                {selectedDir && (
                                    <Button
                                        className="delete-btn"
                                        onClick={handleDeleteFolder}
                                        renderIcon={TrashCan}
                                    >
                                    Delete
                                    </Button>
                                )}
                                <Button
                                    className="create-job-btn"
                                    onClick={() => setIsModalOpen(true)}
                                    renderIcon={Upload}
                                >
                                    Upload File
                                </Button>
                            </div>
                        </div>
                        <div className="file-tree-box">
                            {parsedTree.length > 0 ? renderTree(parsedTree) : "Loading..."}
                        </div>
                    </div>

                    {/* Modal for File Upload */}
                    {isModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Upload File</h3>
                                <input
                                    type="text"
                                    placeholder="Folder Name"
                                    value={folderName}
                                    onChange={(e) => setFolderName(e.target.value)}
                                />
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setSelectedFiles(e.target.files)}
                                />
                                <div className="modal-actions">
                                    <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button onClick={handleFileUpload}>Upload</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Theme>
    );
};

export default FileManage;