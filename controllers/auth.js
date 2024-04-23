const User = require("../models/user");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({
      msg: `Veuillez fournir un email et un mot de passe`,
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: `Aucun compte existe avec cet email` });
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res
      .status(404)
      .json({ msg: `Informations d'identification invalides` });
  }
  // compare password
  const token = user.createJWT();
  res.status(200).json({
    user: {
      id: user._id,
      email: user.email,
    },
    token,
  });
};

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      return res
        .status(500)
        .json({ msg: `L'utilisateur avec cet email existe déjà` });
    }

    const user = await User.create({
      email,
      password,
    });
    const token = user.createJWT();
    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  login,
  register,
};
