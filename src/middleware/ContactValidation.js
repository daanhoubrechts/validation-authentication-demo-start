import { body } from "express-validator";

export default [
  body("fullname")
    .notEmpty()
    .withMessage("Volledige naam is een verplicht veld.")
    .bail()
    .isLength({ min: 2 })
    .withMessage("Volledige naam moet minstens twee tekens bevatten."),
  body("email")
    .notEmpty()
    .withMessage("E-mail is een verplicht veld.")
    .bail()
    .isEmail()
    .withMessage("Onjuist e-mailadres"),
  body("message")
    .notEmpty()
    .withMessage("Bericht is een verplicht veld.")
    .bail()
    .isLength({ min: 10 })
    .withMessage("Bericht moet minstens tien tekens bevatten."),
];
