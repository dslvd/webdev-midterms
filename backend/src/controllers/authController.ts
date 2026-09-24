import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../data/store';
import { LoginInput } from '../schemas/authSchema';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function login(req: Request, res: Response) {
  const { username, password } = req.body as LoginInput;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const passwordMatches = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    },
  });
}
