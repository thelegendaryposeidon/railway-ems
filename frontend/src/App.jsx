import React, { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5001/api';

// --- Helper Functions & Components ---

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

// Header Component
const Header = () => (
    <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                 <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 15.5C4 14.12 5.12 13 6.5 13H17.5C18.88 13 20 14.12 20 15.5V17H4V15.5Z" fill="#FFF"/>
                    <path d="M17.5 9C18.88 9 20 10.12 20 11.5V12H4V11.5C4 10.12 5.12 9 6.5 9H17.5Z" fill="#FFF" fillOpacity="0.6"/>
                    <path d="M12 2C15.31 2 18 4.69 18 8C18 11.31 15.31 14 12 14C8.69 14 6 11.31 6 8C6 4.69 8.69 2 12 2ZM12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4Z" fill="#FF9933"/>
                 </svg>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-wider">Indian Railways</h1>
                    <p className="text-sm sm:text-md text-blue-200">Employee & Transfer Management</p>
                </div>
            </div>
        </div>
    </header>
);

// Form Input Component
const FormInput = ({ id, label, type, value, onChange, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
    </div>
);

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-50 rounded-lg shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Employee Form
const EmployeeForm = ({ onSave, onClose, employee }) => {
    const [formData, setFormData] = useState({
        employeeId: '', firstName: '', lastName: '', dateOfBirth: '', dateOfJoining: '',
        designation: '', department: '', zone: '', division: '', payLevel: '',
        contactNumber: '', email: '', address: ''
    });

    useEffect(() => {
        if (employee) {
            const formattedEmployee = { ...employee };
            if(employee.dateOfBirth) formattedEmployee.dateOfBirth = new Date(employee.dateOfBirth).toISOString().split('T')[0];
            if(employee.dateOfJoining) formattedEmployee.dateOfJoining = new Date(employee.dateOfJoining).toISOString().split('T')[0];
            setFormData(formattedEmployee);
        } else {
             setFormData({
                employeeId: '', firstName: '', lastName: '', dateOfBirth: '', dateOfJoining: '',
                designation: '', department: '', zone: '', division: '', payLevel: '',
                contactNumber: '', email: '', address: ''
            });
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput id="employeeId" label="Employee ID (PF No.)" type="text" value={formData.employeeId} onChange={handleChange} />
                <FormInput id="firstName" label="First Name" type="text" value={formData.firstName} onChange={handleChange} />
                <FormInput id="lastName" label="Last Name" type="text" value={formData.lastName} onChange={handleChange} />
                <FormInput id="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} />
                <FormInput id="contactNumber" label="Contact Number" type="tel" value={formData.contactNumber} onChange={handleChange} />
                <FormInput id="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                <FormInput id="dateOfJoining" label="Date of Joining" type="date" value={formData.dateOfJoining} onChange={handleChange} />
                <FormInput id="designation" label="Designation" type="text" value={formData.designation} onChange={handleChange} />
                <FormInput id="department" label="Department" type="text" value={formData.department} onChange={handleChange} />
                <FormInput id="zone" label="Zone" type="text" value={formData.zone} onChange={handleChange} />
                <FormInput id="division" label="Division" type="text" value={formData.division} onChange={handleChange} />
                <FormInput id="payLevel" label="Pay Level" type="text" value={formData.payLevel} onChange={handleChange} />
                <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea id="address" name="address" rows="3" value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                </div>
            </div>
            <div className="mt-8 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    {employee ? 'Update Employee' : 'Save Employee'}
                </button>
            </div>
        </form>
    );
};

// Transfer Form
const TransferForm = ({ onSave, onClose, allEmployees }) => {
    const [formData, setFormData] = useState({
        employeeId: '',
        toZone: '',
        toDivision: '',
        transferOrderDate: new Date().toISOString().split('T')[0]
    });
    const [currentPosting, setCurrentPosting] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'employeeId') {
            const selectedEmp = allEmployees.find(emp => emp._id === value);
            if (selectedEmp) {
                setCurrentPosting(`From: ${selectedEmp.zone} / ${selectedEmp.division}`);
            } else {
                setCurrentPosting('');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Initiate New Transfer</h2>
            <div className="grid grid-cols-1 gap-6">
                 <div>
                    <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Select Employee</label>
                    <select id="employeeId" name="employeeId" value={formData.employeeId} onChange={handleChange} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        <option value="">-- Select an Employee --</option>
                        {allEmployees.map(emp => (
                            <option key={emp._id} value={emp._id}>{emp.firstName} {emp.lastName} ({emp.employeeId})</option>
                        ))}
                    </select>
                    {currentPosting && <p className="mt-2 text-sm text-gray-500">{currentPosting}</p>}
                </div>
                <FormInput id="toZone" label="To Zone" type="text" value={formData.toZone} onChange={handleChange} />
                <FormInput id="toDivision" label="To Division" type="text" value={formData.toDivision} onChange={handleChange} />
                <FormInput id="transferOrderDate" label="Transfer Order Date" type="date" value={formData.transferOrderDate} onChange={handleChange} />
            </div>
            <div className="mt-8 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Transfer</button>
            </div>
        </form>
    );
};


// --- Main Application Component ---
function App() {
    // General State
    const [currentView, setCurrentView] = useState('employees'); // 'employees' or 'transfers'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Employee State
    const [employees, setEmployees] = useState([]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    // Transfer State
    const [transfers, setTransfers] = useState([]);
    const [allEmployeesList, setAllEmployeesList] = useState([]);
    const [showTransferForm, setShowTransferForm] = useState(false);

    // --- Data Fetching ---
    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/employees?search=${searchTerm}&page=${currentPage}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setEmployees(data.employees);
            setTotalPages(data.totalPages);
            setTotalRecords(data.totalRecords);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, currentPage]);

     const fetchTransfers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/transfers`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setTransfers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAllEmployeesList = useCallback(async () => {
         try {
            const response = await fetch(`${API_BASE_URL}/employees/list`);
            if (!response.ok) throw new Error('Could not fetch employee list');
            const data = await response.json();
            setAllEmployeesList(data);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        if (currentView === 'employees') {
            const timer = setTimeout(() => fetchEmployees(), 300);
            return () => clearTimeout(timer);
        } else {
            fetchTransfers();
        }
    }, [currentView, fetchEmployees, fetchTransfers]);
    
    // --- Employee Handlers ---
    const handleAddNewClick = () => {
        setEditingEmployee(null);
        setShowFormModal(true);
    };
    const handleEditClick = (employee) => {
        setEditingEmployee(employee);
        setShowFormModal(true);
    };
    const handleDeleteClick = (employee) => {
        setEmployeeToDelete(employee);
        setShowDeleteModal(true);
    };
    const confirmDelete = async () => {
        if (!employeeToDelete) return;
        try {
            await fetch(`${API_BASE_URL}/employees/${employeeToDelete._id}`, { method: 'DELETE' });
            fetchEmployees();
            setShowDeleteModal(false);
            setEmployeeToDelete(null);
        } catch (err) { setError(err.message); }
    };
    const handleSaveEmployee = async (employeeData) => {
        const url = employeeData._id ? `${API_BASE_URL}/employees/${employeeData._id}` : `${API_BASE_URL}/employees`;
        const method = employeeData._id ? 'PUT' : 'POST';
        try {
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData),
            });
            setShowFormModal(false);
            setEditingEmployee(null);
            fetchEmployees();
        } catch (err) { setError(err.message); }
    };

    // --- Transfer Handlers ---
    const handleRequestTransferClick = () => {
        fetchAllEmployeesList(); // Fetch fresh list when form is opened
        setShowTransferForm(true);
    };

    const handleSaveTransfer = async (transferData) => {
        try {
            await fetch(`${API_BASE_URL}/transfers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transferData)
            });
            setShowTransferForm(false);
            fetchTransfers();
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleUpdateTransferStatus = async (transferId, status) => {
         try {
            await fetch(`${API_BASE_URL}/transfers/${transferId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            fetchTransfers();
            if (status === 'Completed') fetchEmployees(); // Refresh employee list if posting changed
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* View Switcher */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            <button onClick={() => setCurrentView('employees')} className={`${currentView === 'employees' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                Employee Management
                            </button>
                            <button onClick={() => setCurrentView('transfers')} className={`${currentView === 'transfers' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                                Transfer Management
                            </button>
                        </nav>
                    </div>

                    {/* Conditional Rendering based on View */}
                    {currentView === 'employees' ? (
                    <>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="relative w-full md:w-1/2 lg:w-1/3">
                            <input type="text" placeholder="Search by name, ID, designation..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full pl-10 pr-4 py-2 border rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                            <svg className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <button onClick={handleAddNewClick} className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300">
                             <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            Add New Employee
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Posting</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th><th className="relative px-6 py-3"><span className="sr-only">Actions</span></th></tr></thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (<tr><td colSpan="5" className="text-center py-10">Loading...</td></tr>) : error ? (<tr><td colSpan="5" className="text-center py-10 text-red-500">Error: {error}</td></tr>) : employees.length > 0 ? (employees.map(employee => (
                                    <tr key={employee._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{employee.firstName} {employee.lastName}</div><div className="text-sm text-gray-500">{employee.employeeId}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.designation}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{employee.zone}</div><div className="text-sm text-gray-500">{employee.division}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{employee.contactNumber}</div><div className="text-sm text-gray-500">{employee.email}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div className="flex items-center justify-end space-x-4"><button onClick={() => handleEditClick(employee)} className="text-blue-600 hover:text-blue-900"><svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button><button onClick={() => handleDeleteClick(employee)} className="text-red-600 hover:text-red-900"><svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button></div></td>
                                    </tr>))) : (<tr><td colSpan="5" className="text-center py-10">No employees found.</td></tr>)}</tbody>
                        </table>
                    </div>
                    {!loading && totalRecords > 0 && (<div className="flex items-center justify-between py-3"><div className="text-sm text-gray-700">Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span> (<span className="font-medium">{totalRecords}</span> results)</div><div className="flex-1 flex justify-end"><button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button><button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Next</button></div></div>)}
                    </>
                    ) : (
                    <>
                        <div className="flex justify-end mb-6">
                            <button onClick={handleRequestTransferClick} className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300">
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                Request New Transfer
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="min-w-full divide-y divide-gray-200">
                               <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th></tr></thead>
                               <tbody className="bg-white divide-y divide-gray-200">
                                   {loading ? (<tr><td colSpan="5" className="text-center py-10">Loading transfers...</td></tr>) : error ? (<tr><td colSpan="5" className="text-center py-10 text-red-500">Error: {error}</td></tr>) : transfers.length > 0 ? (transfers.map(t => (
                                       <tr key={t._id}>
                                           <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{t.employee?.firstName} {t.employee?.lastName}</div><div className="text-sm text-gray-500">{t.employee?.employeeId}</div></td>
                                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{t.fromZone} / {t.fromDivision}</td>
                                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{t.toZone} / {t.toDivision}</td>
                                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(t.transferOrderDate)}</td>
                                           <td className="px-6 py-4 whitespace-nowrap">
                                                <select value={t.status} onChange={(e) => handleUpdateTransferStatus(t._id, e.target.value)} className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                                                    <option>Pending</option><option>Approved</option><option>Completed</option><option>Cancelled</option>
                                                </select>
                                           </td>
                                       </tr>))) : (<tr><td colSpan="5" className="text-center py-10">No transfer requests found.</td></tr>)}
                               </tbody>
                           </table>
                        </div>
                    </>
                    )}
                </div>
            </main>

            {/* Modals */}
            <Modal isOpen={showFormModal} onClose={() => setShowFormModal(false)}><EmployeeForm onSave={handleSaveEmployee} onClose={() => setShowFormModal(false)} employee={editingEmployee} /></Modal>
            <Modal isOpen={showTransferForm} onClose={() => setShowTransferForm(false)}><TransferForm onSave={handleSaveTransfer} onClose={() => setShowTransferForm(false)} allEmployees={allEmployeesList} /></Modal>
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}><div className="text-center"><h3 className="text-lg font-medium text-gray-900">Delete Employee</h3><div className="mt-2 px-7 py-3"><p className="text-sm text-gray-500">Are you sure you want to delete {employeeToDelete?.firstName} {employeeToDelete?.lastName}? This action cannot be undone.</p></div><div className="flex justify-center gap-4 px-4 py-3"><button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button><button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button></div></div></Modal>
        </div>
    );
}

export default App;

