const DeliveryPoint = require('../schemas/DeliveryPoint');
const User = require('../schemas/User');
const {
  createDeliveryPointSchema,
  updateDeliveryPointSchema,
} = require('../validation/deliveryPoint');

const createDeliveryPoint = async (req, res) => {
  try {
    const { error, value } = createDeliveryPointSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { name, userId, location } = value;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existing = await DeliveryPoint.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Name already exists' });

    const newDP = new DeliveryPoint({ name, userId, location });
    await newDP.save();

    res.status(201).json({ message: 'Delivery point created', data: newDP });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllDeliveryPoints = async (req, res) => {
  try {
    const data = await DeliveryPoint.findById(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getDeliveryPointById = async (req,res)=>{
 try {
    const data = await DeliveryPoint.find({ isActive: true }).populate('userId', 'name mobileNumber');
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

const updateDeliveryPoint = async (req, res) => {
  try {
    const { error, value } = updateDeliveryPointSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });


    const updated = await DeliveryPoint.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!updated) return res.status(404).json({ message: 'Delivery point not found' });

    res.status(200).json({ message: 'Updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteDeliveryPoint = async (req, res) => {
  try {
    const dp = await DeliveryPoint.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!dp) return res.status(404).json({ message: 'Delivery point not found' });

    res.status(200).json({ message: 'Delivery point disabled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createDeliveryPoint,
  getAllDeliveryPoints,
  getDeliveryPointById,
  updateDeliveryPoint,
  deleteDeliveryPoint,
};
