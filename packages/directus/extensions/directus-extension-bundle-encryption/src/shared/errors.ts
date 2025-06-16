import { createError } from '@directus/errors';
export const ForbiddenError = createError('FORBIDDEN', "You don't have permissions to see this.", 403);