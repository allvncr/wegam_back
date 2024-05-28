const nodemailer = require("nodemailer");

// Configuration de Nodemailer pour PlanetHost
const transporter = nodemailer.createTransport({
  host: "wegamstudio.com",
  port: 465,
  secure: true,
  auth: {
    user: "hello@wegamstudio.com",
    pass: "1croy@bleStudio",
  },
});

// Controller function to create a new category
const postFormulaire = async (req, res) => {
  try {
    const { name, message } = req.body;

    const mailOptions = {
      from: "hello@wegamstudio.com",
      to: "hello@wegamstudio.com",
      subject: `Nouveau message de ${name} - WegamStudio`,
      html: `
        <h2>Nouveau message</h2>
        <p><strong>Client:</strong>  ${name}</p><br/>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    transporter.sendMail(mailOptions);
    res.status(201).json({});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  postFormulaire,
};
