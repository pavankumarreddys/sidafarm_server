const Vehicle = require("../schemas/Vehicle");
const User = require("../schemas/User");
const { registerVehicleSchema } = require("../validation/vehicleValidation");

// Register a new vehicle write description
/** 
 * Registers a new vehicle and its driver.
 * If the driver does not exist, it creates a new user for the driver.  
 * @param {Object} req - The request object containing vehicle and driver details.
 * @param {Object} res - The response object to send the result.
 */

const registerVehicle = async (req, res) => {
  try {
    // Joi validation
    const { error, value } = registerVehicleSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    //type => 'Small', 'Dcm'

    const { vehicleNumber, type, driverName, mobileNumber, driverRole } = value;

    // Step 1: Check or create driver user
    let driverUser = await User.findOne({ mobileNumber });

    if (!driverUser) {
      driverUser = await User.create({
        name: driverName,
        mobileNumber,
        role: driverRole,
        isVerified: true,
      });
    }

    // Step 2: Check if vehicle already exists
    const existingVehicle = await Vehicle.findOne({ vehicleNumber });
    if (existingVehicle) {
      return res
        .status(409)
        .json({ message: "Vehicle number already exists." });
    }

    // Step 3: Create new vehicle
    const newVehicle = await Vehicle.create({
      vehicleNumber,
      type,
      driver: driverUser._id,
    });

    res.status(201).json({
      message: "Vehicle and driver registered successfully.",
      vehicle: newVehicle,
    });
  } catch (err) {
    console.error("Error in registerVehicle:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all vehicles
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.status(200).json({ success: true, data: vehicles });
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get vehicle by ID not by vehicleNumber

/**
 * Fetches a vehicle by its ID.
 * @param {Object} req - The request object containing the vehicle ID.
 * @param {Object} res - The response object to send the result.
 */

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }
    res.status(200).json({ success: true, data: vehicle });
  } catch (err) {
    console.error("Error fetching vehicle by ID:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { registerVehicle, getAllVehicles, getVehicleById };
