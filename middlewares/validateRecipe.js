const Joi = require("joi");

const validateRecipe = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    category: Joi.string().min(3).max(50).required(),
    description: Joi.string().required(),
    ingredients: Joi.string().required(),
    image: Joi.string().optional(),
    calories: Joi.number().integer().min(0).required(),
    carbs: Joi.number().integer().min(0).required(),
    protein: Joi.number().integer().min(0).required(),
    fats: Joi.number().integer().min(0).required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return;
  }

  next();
};

module.exports = validateRecipe;
