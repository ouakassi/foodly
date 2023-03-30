const Address = require("../models/addressModel");
const User = require("../models/userModel");

// Get all addresses
// GET /api/admin/users/addresses
// Private : admin
const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({});
    if (addresses.length === 0) {
      return res.status(404).json({ message: "no address found" });
    }
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all addresses of one user
// GET /api/users/userId/addresses/
// Public
const getAddresses = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const userAddresses = await Address.findAll({ where: { userId: user.id } });

    if (userAddresses.length === 0) {
      return res
        .status(404)
        .json({ message: `User ${user.id} has no Addresses ` });
    }
    res.status(200).json(userAddresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one user address
// GET /api/users/userId/addresses/
const getAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const user = await User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userAddress = await Address.findOne({
      where: { id: addressId, userId: user.id },
    });

    if (!userAddress) {
      return res.status(404).json({
        message: `User ${user.id} has no Addresse with this id `,
      });
    }
    res.status(200).json(userAddress);
    console.log(userAddress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// create one user address
// POST /api/users/userId/addresses/
const createAddress = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const { addressLineOne, addressLineTwo, city, postalCode, country, phone } =
      req.body;
    const userAddress = await Address.create({
      addressLineOne,
      addressLineTwo,
      city,
      postalCode,
      country,
      phone,
      userId: user.id,
    });
    res.status(200).json(userAddress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update one user address
// PUT /api/users/userId/addresses/addressId
const updateAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const { addressLineOne, addressLineTwo, city, postalCode, country, phone } =
      req.body;
    const updatedAddress = await Address.update(
      {
        addressLineOne,
        addressLineTwo,
        city,
        postalCode,
        country,
        phone,
      },
      { where: { id: addressId } }
    );
    res.status(200).json({
      message: `address with id ${updatedAddress.id} updated successfully`,
      updatedAddress,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete one user address
// DELETE /api/users/userId/addresses/addressId
const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const user = await User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const deletedAddress = await Address.destroy({
      where: { id: addressId, userId: user.id },
    });

    if (!deletedAddress) {
      return res.status(404).json({
        message: `User ${user.id} has no Addresse with this id `,
      });
    }
    res.status(200).json({
      message: `address with id ${addressId} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllAddresses,
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
};
