const User = require("../models/user");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Veuillez fournir un email et un mot de passe",
    });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ msg: "Aucun compte existe avec cet email" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ msg: "Informations d'identification invalides" });
    }

    const token = user.generateJWT();
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const emailAlreadyExists = await User.findOne({ where: { email } });
    if (emailAlreadyExists) {
      return res
        .status(400)
        .json({ msg: "L'utilisateur avec cet email existe déjà" });
    }

    const newUser = await User.create({ email, password });
    const token = newUser.generateJWT();
    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  login,
  register,
};
