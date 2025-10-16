const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Successfully connected to MongoDB."))
    .catch(err => console.error("MongoDB connection error:", err));

// --- Employee Mongoose Schema & Model ---
const employeeSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    dateOfJoining: { type: Date, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    zone: { type: String, required: true },
    division: { type: String, required: true },
    payLevel: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

// --- Transfer Mongoose Schema & Model ---
const transferSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    fromZone: { type: String, required: true },
    fromDivision: { type: String, required: true },
    toZone: { type: String, required: true },
    toDivision: { type: String, required: true },
    transferOrderDate: { type: Date, required: true },
    status: { type: String, required: true, enum: ['Pending', 'Approved', 'Completed', 'Cancelled'], default: 'Pending' },
}, { timestamps: true });

const Transfer = mongoose.model('Transfer', transferSchema);


// --- API Routes ---

// --- Employee API Routes ---

// 1. CREATE a new employee
app.post('/api/employees', async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(400).json({ message: "Failed to create employee.", error: error.message });
    }
});

// 2. READ all employees with search and pagination
app.get('/api/employees', async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        const searchRegex = new RegExp(search, 'i');
        
        const query = {
            $or: [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { employeeId: searchRegex },
                { designation: searchRegex },
                { department: searchRegex },
            ]
        };
        
        const employees = await Employee.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((page - 1) * limit);

        const totalRecords = await Employee.countDocuments(query);
        
        res.status(200).json({
            employees,
            totalPages: Math.ceil(totalRecords / limit),
            currentPage: parseInt(page),
            totalRecords
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Failed to fetch employees.", error: error.message });
    }
});

// 3. READ a list of employees (for transfer form dropdown)
app.get('/api/employees/list', async (req, res) => {
    try {
        const employees = await Employee.find({}, 'firstName lastName employeeId zone division').sort({ firstName: 1 });
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employee list:", error);
        res.status(500).json({ message: "Failed to fetch employee list.", error: error.message });
    }
});

// 4. READ a single employee by ID
app.get('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }
        res.status(200).json(employee);
    } catch (error) {
        console.error("Error fetching employee:", error);
        res.status(500).json({ message: "Failed to fetch employee.", error: error.message });
    }
});

// 5. UPDATE an employee by ID
app.put('/api/employees/:id', async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found." });
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(400).json({ message: "Failed to update employee.", error: error.message });
    }
});

// 6. DELETE an employee by ID
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found." });
        }
        // Also delete any associated transfer requests
        await Transfer.deleteMany({ employee: req.params.id });
        res.status(200).json({ message: "Employee and associated transfers deleted successfully." });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Failed to delete employee.", error: error.message });
    }
});


// --- Transfer API Routes ---

// 1. CREATE a new transfer request
app.post('/api/transfers', async (req, res) => {
    try {
        const { employeeId, toZone, toDivision, transferOrderDate } = req.body;
        
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        const transferData = {
            employee: employeeId,
            fromZone: employee.zone,
            fromDivision: employee.division,
            toZone,
            toDivision,
            transferOrderDate,
        };

        const newTransfer = new Transfer(transferData);
        await newTransfer.save();
        res.status(201).json(newTransfer);
    } catch (error) {
        console.error("Error creating transfer request:", error);
        res.status(400).json({ message: "Failed to create transfer request.", error: error.message });
    }
});

// 2. READ all transfer requests
app.get('/api/transfers', async (req, res) => {
    try {
        const transfers = await Transfer.find()
            .populate('employee', 'firstName lastName employeeId') // Populate with specific employee fields
            .sort({ createdAt: -1 });
        res.status(200).json(transfers);
    } catch (error) {
        console.error("Error fetching transfers:", error);
        res.status(500).json({ message: "Failed to fetch transfers.", error: error.message });
    }
});

// 3. UPDATE a transfer status
app.put('/api/transfers/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const transfer = await Transfer.findById(req.params.id);

        if (!transfer) {
            return res.status(404).json({ message: "Transfer record not found." });
        }

        transfer.status = status;

        // If the transfer is completed, update the employee's record
        if (status === 'Completed') {
            await Employee.findByIdAndUpdate(transfer.employee, {
                zone: transfer.toZone,
                division: transfer.toDivision,
            });
        }

        await transfer.save();
        res.status(200).json(transfer);
    } catch (error) {
        console.error("Error updating transfer:", error);
        res.status(400).json({ message: "Failed to update transfer.", error: error.message });
    }
});

// 4. DELETE a transfer request
app.delete('/api/transfers/:id', async (req, res) => {
    try {
        const deletedTransfer = await Transfer.findByIdAndDelete(req.params.id);
        if (!deletedTransfer) {
            return res.status(404).json({ message: "Transfer record not found." });
        }
        res.status(200).json({ message: "Transfer record deleted successfully." });
    } catch (error) {
        console.error("Error deleting transfer:", error);
        res.status(500).json({ message: "Failed to delete transfer.", error: error.message });
    }
});


// --- Root Endpoint ---
app.get('/', (req, res) => {
    res.send('Indian Railway EMS API is running...');
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

