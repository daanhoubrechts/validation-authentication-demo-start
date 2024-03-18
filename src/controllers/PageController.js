/**
 * A Page Controller
 */

import { validationResult } from "express-validator";
import MailTransporter from "../lib/MailTransporter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/User.js";

export const home = async (req, res) => {
  const token = req.cookies.user;

  if (token) {
    const userData = jwt.verify(token, process.env.TOKEN_SALT);
    if (userData) {
      const user = await User.query().findOne({ id: userData.id });
      res.render("home", { user });
      return;
    }
  }

  res.render("home", {});
};

export const contact = (req, res) => {
  // create input fields
  const inputs = [
    {
      name: "fullname",
      label: "Volledige naam",
      type: "text",
      err: req.formErrorFields?.fullname ? req.formErrorFields.fullname : "",
      value: req.body?.fullname ? req.body.fullname : "",
    },
    {
      name: "email",
      label: "Jouw e-mail adres",
      type: "text",
      err: req.formErrorFields?.email ? req.formErrorFields.email : "",
      value: req.body?.email ? req.body.email : "",
    },
    {
      name: "message",
      label: "Jouw bericht",
      type: "textarea",
      err: req.formErrorFields?.message ? req.formErrorFields.message : "",
      value: req.body?.message ? req.body.message : "",
    },
  ];

  // get flash message if available
  const flash = req.flash || "";

  res.render("contact", {
    inputs,
    flash,
  });
};

/**
 * This function handles the post request for the contact page
 */
export const postContact = async (req, res, next) => {
  // check errors and show in browser
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.formErrorFields = {};
    errors.array().forEach((error) => {
      req.formErrorFields[error.path] = error.msg;
    });

    // set flash message
    req.flash = {
      type: "danger",
      message: "Er zijn fouten gevonden in je formulier",
    };

    // show errors in browser via the contact page
    return next();
  }

  // send email
  try {
    const mailInfo = await MailTransporter.sendMail({
      from: "noreply@pgm.be",
      cc: "georgette@pgm.be",
      to: req.body.email,
      replyTo: req.body.email,
      subject: "Nieuw bericht via contactformulier Georgette's Parfumwinkel",
      html: `
        <p>Van: ${req.body.fullname}</p>
        <p>E-mail: ${req.body.email}</p>
        <p>Bericht: ${req.body.message}</p>
      `,
    });

    // set flash message
    req.flash = {
      type: "success",
      message:
        "Bedankt voor je bericht. Georgette gaat ermee aan de slag!<br>" +
        mailInfo.messageId,
    };

    // clear form fields
    req.body = {};

    return next();
  } catch (error) {
    req.flash = {
      type: "danger",
      message:
        "Er is een fout opgetreden bij het versturen van je bericht <br>" +
        error.message,
    };
    return next();
  }
};
