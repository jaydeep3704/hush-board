import { z } from 'zod'
import { validatePassword } from './signupSchema';
export const signInSchema = z.object({
  identifier: z.string(),
  password: validatePassword,
});
