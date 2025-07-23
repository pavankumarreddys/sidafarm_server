const Vehicle = require('../schemas/Vehicle');
const User = require('../schemas/User');
const { registerVehicleSchema } = require('../validation/vehicleValidation');

const registerVehicle = async (req, res) => {
  try {
    // Joi validation
    const { error, value } = registerVehicleSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });


    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.details.map((err) => err.message)
      });
    }

    const {
      vehicleNumber,
      type,
      driverName,
      mobileNumber,
      driverRole
    } = value;

    // Step 1: Check or create driver user
    let driverUser = await User.findOne({ mobileNumber });

    if (!driverUser) {
      driverUser = await User.create({
        name: driverName,
        mobileNumber,
        role: driverRole,
        isVerified: true
      });
    }

    // Step 2: Check if vehicle already exists
    const existingVehicle = await Vehicle.findOne({ vehicleNumber });
    if (existingVehicle) {
      return res.status(409).json({ message: 'Vehicle number already exists.' });
    }

    // Step 3: Create new vehicle
    const newVehicle = await Vehicle.create({
      vehicleNumber,
      type,
      driver: driverUser._id
    });

    res.status(201).json({
      message: 'Vehicle and driver registered successfully.',
      vehicle: newVehicle
    });

  } catch (err) {
    console.error('Error in registerVehicle:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerVehicle };
