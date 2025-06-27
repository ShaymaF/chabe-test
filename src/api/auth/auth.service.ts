import jwt from 'jsonwebtoken';

const API_CLIENT_SECRET = process.env.API_CLIENT_SECRET || "chabe";

class AuthService {
  public generateTestToken(): string {
    const payload = {
      user: 'api-tester',
      purpose: 'testing-endpoints',
      iat: Math.floor(Date.now() / 1000), // "issued at" in seconds
    };

    const token = jwt.sign(payload, API_CLIENT_SECRET, { expiresIn: '1h' });

    return token;
  }
}

export const authService = new AuthService();