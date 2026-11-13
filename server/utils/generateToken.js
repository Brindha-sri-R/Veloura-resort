import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token with user ID and 7-day expiration
 */
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'veloura_jwt_secret_luxury_retreat_2026';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '7d'
  });
};

export default generateToken;

