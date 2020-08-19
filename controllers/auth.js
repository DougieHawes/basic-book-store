const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const User = require("../models/User");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.status(401).json({ msg: "user already exists" });
  }

  const token = jwt.sign(
    { username, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    { expiresIn: 600 }
  );

  const emailData = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `${username}, please activate your account at BasicBookStore`,
    html: `
      <p>please click the below link to activate your account at BasicBookStore</p>
      <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
      <hr/>
      <p>${process.env.CLIENT_URL}</p>
    `,
  };

  sgMail.send(emailData).then((send) => {
    return res.status(200).json({ msg: `email has been sent to ${email}` });
  });
};

exports.activateUser = async (req, res) => {
  try {
    const { token } = req.body;

    if (token) {
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
        if (err) {
          return res.status(401).json({ msg: "expired link" });
        }
      });

      const { username, email, password } = jwt.decode(token);

      const avatar = gravatar.url(email, { s: "210", r: "pg", d: "mm" });

      const user = new User({ username, email, avatar, password });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.json({ msg: "signup success" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ msg: "server error" });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
};
