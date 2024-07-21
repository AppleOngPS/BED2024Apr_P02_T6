const Joi = require("joi");

const postSchema = Joi.object({
  title: Joi.string().max(255).required(),
  category: Joi.string().valid("General", "Events", "Announcements").required(),
  content: Joi.any().optional(),
  message: Joi.string().min(1).required(),
});

function validatePost(req, res, next) {
  const { error } = postSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = validatePost;
