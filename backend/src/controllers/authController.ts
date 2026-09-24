import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../data/store';
import { LoginInput } from '../schemas/authSchema';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function login(req: Request, res: Response): void {
  const { email, password } = req.body as LoginInput;

  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '8h',
  });

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}
