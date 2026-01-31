import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const tokenUsageSchema = Joi.object({
  session_id: Joi.string().required(),
  model: Joi.string().required(),
  input_tokens: Joi.number().integer().min(0).required(),
  output_tokens: Joi.number().integer().min(0).required(),
  cost: Joi.number().min(0).required()
});

const usageLimitSchema = Joi.object({
  limit_type: Joi.string().valid('daily', 'monthly', 'session').required(),
  limit_value: Joi.number().integer().min(1).required(),
  alert_threshold: Joi.number().integer().min(0).max(100).required()
});

const apiKeySchema = Joi.object({
  name: Joi.string().required(),
  key: Joi.string().required(),
  provider: Joi.string().valid('anthropic', 'openai', 'other').required(),
  daily_limit: Joi.number().integer().min(0).optional(),
  monthly_limit: Joi.number().integer().min(0).optional()
});

export const validateTokenUsage = (req: Request, res: Response, next: NextFunction) => {
  const { error } = tokenUsageSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};

export const validateUsageLimit = (req: Request, res: Response, next: NextFunction) => {
  const { error } = usageLimitSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const { error } = apiKeySchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};
