/**
 * A Page Controller
 */

export const home = async (req, res) => {
  res.render("home", {});
};

/*
 * A contact page
 */
export const contact = (req, res) => {
  const inputs = [
    {
      name: "fullname",
      label: "Volledige naam",
      type: "text",
      err: req.formErrorFields?.fullname ? req.formErrorFields["fullname"] : "",
      value: req.body?.fullname ? req.body.fullname : "",
    },
    {
      name: "email",
      label: "E-mail",
      type: "text",
      err: req.formErrorFields?.email ? req.formErrorFields["email"] : "",
      value: req.body?.email ? req.body.email : "",
    },
    {
      name: "message",
      label: "Bericht",
      type: "textarea",
      err: req.formErrorFields?.message ? req.formErrorFields["message"] : "",
      value: req.body?.message ? req.body.message : "",
    },
  ];

  const flash = req.flash || {};

  res.render("contact", {
    inputs,
    flash,
  });
};

/**
 * This function handles the post request for the contact page
 */
export const postContact = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // set the form error fields
    req.formErrorFields = {};
    errors.array().forEach((error) => {
      req.formErrorFields[error.path] = error.msg;
    });

    // set the flash message
    req.flash = {
      type: "danger",
      message: "Er zijn fouten opgetreden",
    };

    return next();
  }
};
