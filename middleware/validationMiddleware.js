import Joi from "joi";

// ✅ User Validation
export const userValidation = Joi.object({
  userName: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "semiAdmin", "user").default("user"),
});

// ✅ Post Validation
export const postValidation = Joi.object({
  userId: Joi.string().hex().length(24), // ObjectId
  title: Joi.string().trim().required(),
  description: Joi.string().allow("").optional(),
  images: Joi.array().items(
    Joi.object({
      imageUrl: Joi.string().uri().allow(null).optional(),
      imageCaption: Joi.string().default("No Caption of image"),
    }),
  ),
  postType: Joi.string()
    .valid(
      "lifestyle",
      "fitness",
      "entertainment",
      "devotional",
      "gaming",
      "sports",
    )
    .default("lifestyle"),
});
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
// ✅ Like Validation
export const likeValidation = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  postId: Joi.string().hex().length(24).required(),
});

// ✅ Comment Validation
export const commentValidation = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  postId: Joi.string().hex().length(24).required(),
  text: Joi.string().trim().allow("").default(""),
  replies: Joi.array().items(
    Joi.object({
      userId: Joi.string().hex().length(24).required(),
      replyByUser: Joi.string().hex().length(24).required(),
      text: Joi.string().trim().required(),
    }),
  ),
});

// ✅ Follow Validation
export const followValidation = Joi.object({
  followerId: Joi.string().hex().length(24).required(),
  followedId: Joi.string().hex().length(24).required(),
});
