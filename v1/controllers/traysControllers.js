const { DateTime } = require("luxon");
const TrayLoading = require("../schemas/TrayLoading");
const trayLoadingSchema = require("../validation/trayLoading");
const Vehicle = require("../schemas/Vehicle");
const User = require("../schemas/User"); 
const createTrayLoading = async (req, res) => {
  try {
    console.log("Creating tray loading with data:", req.body);
    const { error, value } = trayLoadingSchema.trayLoadingSchema.validate(
      req.body
    );
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const {
      vehicleId,
      totalTraysLoaded,
      totalEmptyTrays,
      confirmedByAreaIncharge,
      status,
      reason,
      remarks,
      emptyTraysCount,
      emptyTraysVerifiedByDriver,
      emptyTraysVerifiedAt,
    } = value;

    // Get current time in Asia/Kolkata
    const kolkataNow = DateTime.now().setZone("Asia/Kolkata");

    // If time is 7PM (19:00) or later, use tomorrow’s date
    const adjustedDate =
      kolkataNow.hour >= 19 ? kolkataNow.plus({ days: 1 }) : kolkataNow;

    const formattedDate = adjustedDate.toISODate(); // yyyy-mm-dd

    const trayLoading = new TrayLoading({
      vehicleId,
      date: formattedDate,
      totalTraysLoaded,
      totalEmptyTrays,
      confirmedByAreaIncharge,
      status,
      reason,
      remarks,
      emptyTraysCount,
      emptyTraysVerifiedByDriver,
      emptyTraysVerifiedAt,
    });

    const savedTrayLoading = await trayLoading.save();

    res.status(201).json({
      success: true,
      message: "Tray loading created",
      data: savedTrayLoading,
    });
  } catch (err) {
    console.error("Error creating tray loading:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

const getAllTrayLoadings = async (req, res) => {
  try {
    const trayLoadings = await TrayLoading.find();
    if (!trayLoadings || trayLoadings.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No tray loading found", data: [] });
    }
    res.status(200).json({ success: true, data: trayLoadings });
  } catch (err) {
    console.error("Error fetching tray loadings:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

// const getTodayTrayLoading = async (req, res) => {
//   try {
//     // Get current time in Asia/Kolkata
//     const kolkataNow = DateTime.now().setZone("Asia/Kolkata");
//     // If time is 7PM (19:00) or later, use tomorrow’s date
//     const adjustedDate =
//       kolkataNow.hour >= 19 ? kolkataNow.plus({ days: 1 }) : kolkataNow;
//     const formattedDate = adjustedDate.toISODate(); // yyyy-mm-dd

//     // Find today's tray loadings
//     const trayLoadings = await TrayLoading.find({ date: formattedDate });

//     if (!trayLoadings || trayLoadings.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No tray loading found for today",
//         data: [],
//       });
//     }

//     // Collect unique userIds and vehicleIds from trayLoadings
//     const userIds = [
//       ...new Set(trayLoadings.map((loading) => loading.driver?.toString()).filter(Boolean)),
//     ];
//     const vehicleIds = [
//       ...new Set(trayLoadings.map((loading) => loading.vehicleId?.toString()).filter(Boolean)),
//     ];

//     // Fetch user and vehicle details
//     const users = await User.find({ _id: { $in: userIds } });
//     const vehicles = await Vehicle.find({ _id: { $in: vehicleIds } });

//     // Prepare response
//     res.status(200).json({
//       success: true,
//       vehiclesDetails: vehicles,
//       userDetails: users,
//       trayLoadingDetails: trayLoadings,
//     });
//   } catch (err) {
//     console.error("Error fetching today's tray loading:", err);
//     res
//       .status(500)
//       .json({ success: false, message: "Server Error", error: err.message });
//   }
// };


const getTodayTrayLoading = async (req, res) => {
  try {
    // Get current time in Asia/Kolkata
    const kolkataNow = DateTime.now().setZone("Asia/Kolkata");
    // If time is 7PM (19:00) or later, use tomorrow’s date
    const adjustedDate =
      kolkataNow.hour >= 19 ? kolkataNow.plus({ days: 1 }) : kolkataNow;
    const formattedDate = adjustedDate.toISODate(); // yyyy-mm-dd

    // Fetch all active vehicles with their driver details
    const vehicles = await Vehicle.find({ active: true }).populate({
      path: 'driver',
      match: { isActive: true, role: { $in: ['driver', 'dcmdriver'] } },
      select: 'name mobileNumber role isActive'
    });

    // Filter out vehicles where driver is null (due to populate match)
    const validVehicles = vehicles.filter(vehicle => vehicle.driver);

    // Find today's tray loadings
    const trayLoadings = await TrayLoading.find({ date: formattedDate });

    // Collect unique userIds from trayLoadings for confirmedByAreaIncharge and emptyTraysVerifiedByDriver
    const userIds = [
      ...new Set(
        trayLoadings
          .map((loading) => [
            loading.confirmedByAreaIncharge?.toString(),
            loading.emptyTraysVerifiedByDriver?.toString()
          ])
          .flat()
          .filter(Boolean)
      )
    ];

    // Fetch user details for area incharges and verifying drivers
    const users = await User.find({
      _id: { $in: userIds },
      role: { $in: ['pointincharge', 'areaincharge'] }
    }).select('name mobileNumber role isActive');

    // Create vehicle details with associated driver, tray loading, and user details
    const vehicleDetails = validVehicles.map(vehicle => {
      // Find tray loading for this vehicle, if it exists
      const trayLoading = trayLoadings.find(
        loading => loading.vehicleId.toString() === vehicle._id.toString()
      );

      // Find relevant users for this tray loading (confirmedByAreaIncharge, emptyTraysVerifiedByDriver)
      const relevantUsers = trayLoading
        ? users.filter(user =>
            [
              trayLoading.confirmedByAreaIncharge?.toString(),
              trayLoading.emptyTraysVerifiedByDriver?.toString()
            ].includes(user._id.toString())
          )
        : [];

      return {
        vehicleId: vehicle._id,
        vehicleNumber: vehicle.vehicleNumber,
        vehicleType: vehicle.type,
        driverDetails: {
          userId: vehicle.driver._id,
          name: vehicle.driver.name,
          mobileNumber: vehicle.driver.mobileNumber,
          role: vehicle.driver.role
        },
        trayLoadingDetails: trayLoading || null,
        usersDetails: relevantUsers.map(user => ({
          userId: user._id,
          name: user.name,
          mobileNumber: user.mobileNumber,
          role: user.role
        }))
      };
    });

    // Prepare response
    res.status(200).json({
      success: true,
      vehicleDetails: vehicleDetails
    });
  } catch (err) {
    console.error("Error fetching today's tray loading:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};


const getTrayLoadingbyId = async (req, res) => {
  try {
    const id = req.params.id;

    const trayLoading = await TrayLoading.findOne({ _id: id });
    if (!trayLoading) {
      return res
        .status(404)
        .json({ success: false, message: "Tray loading not found by id" });
    }
    res.status(200).json({ success: true, data: trayLoading });
  } catch (err) {
    console.error("Error fetching tray loading by ID:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

const updateTrayLoadingById = async (req, res) => {
  try {
    const { error, value } = trayLoadingSchema.trayLoadingUpdateSchema.validate(
      req.body
    );
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const id = req.params.id;

    const updatedTrayLoading = await TrayLoading.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedTrayLoading) {
      return res
        .status(404)
        .json({ success: false, message: "Tray loading not found" });
    }

    res.status(200).json({
      success: true,
      message: "Tray loading updated successfully",
      data: updatedTrayLoading,
    });
  } catch (err) {
    console.error("Error updating tray loading:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

module.exports = {
  createTrayLoading,
  getTodayTrayLoading,
  updateTrayLoadingById,
  getTrayLoadingbyId,
  getAllTrayLoadings,
};
