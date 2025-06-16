import type { NextFunction } from "express";
import type { Accountability } from "../types";
import { ForbiddenError } from '../errors';
export const checkAccountability = (accountability: Accountability | undefined, next: NextFunction)  => {
  if (!accountability?.user) {
			return next(new ForbiddenError());
  }
}
