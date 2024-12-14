import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateGV = ({ show, onClose, onSave }) => {
    const [teacherData, setTeacherData] = useState({
        name: "",
        phone: "",
        address: "",
        position: "",
        department: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeacherData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = () => {
        // Validate inputs
        if (!teacherData.name || !teacherData.phone) {
            alert("Please fill in all required fields.");
            return;
        }

        // Pass data to parent component
        onSave(teacherData);

        // Clear form and close modal
        setTeacherData({ name: "", phone: "", address: "", position: "", department: "" });
        onClose();
    };

    return (
        <div className={`modal ${show ? "d-block" : "d-none"}`} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Teacher</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={teacherData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phone"
                                    name="phone"
                                    value={teacherData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    name="address"
                                    value={teacherData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="position" className="form-label">
                                    Position
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="position"
                                    name="position"
                                    value={teacherData.position}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="department" className="form-label">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="department"
                                    name="department"
                                    value={teacherData.department}
                                    onChange={handleChange}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateGV;
