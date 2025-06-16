import { getUsersService } from "../../utils/users";
import type {
  Accountability,
  FactoryFunction,
  PrimaryKey,
  User,
  UserID
} from "../../types";

export const formatUserID = (user: User): UserID => {
  if (!user || ['number', 'string'].includes(typeof user)) {
    throw new Error('Invalid user');
  }
  return {
    name: [user.first_name ?? "", user.last_name ?? ""].join(' '),
    email: user.email!,
    comment: user.description!
  }
}
  
export const generateRetrieveCurrentUserID: FactoryFunction<UserID, [accountability: Accountability]> = (ctx) => {
  return async(accountability) => {
    const service = await getUsersService(ctx, { accountability });
    const user = await service.readOne(accountability.user!) as User;
    return formatUserID(user);
  }
}
  
export const generateRetrieveUserIDs: FactoryFunction<UserID[], [accountability: Accountability, users: PrimaryKey[] | User[]]> = (ctx) => {
  return async(accountability, users) => {
    if (!users || users.length === 0) {
      return [];
    }
    const service = await getUsersService(ctx, { accountability });
    if (Array.isArray(users)) {
      let data = users;
      if (data.every(user => ['number', 'string'].includes(typeof user))) {
        data = await service.readMany(data as PrimaryKey[]) as User[];
      }
      return data.map((user) => formatUserID(user as User));
    }
    throw new Error('Invalid users');
  }
}
  
export const generateRetrieveCurrentUser: FactoryFunction<User, [accountability: Accountability]> = (ctx) => {
  return async(accountability) => {
    const service = await getUsersService(ctx, { accountability });
    const user = await service.readOne(accountability.user!) as User;
    return user;
  }
}
  
export const generateRetrieveUser: FactoryFunction<User, [id: string | User, accountability: Accountability]> = (ctx) => {
  return async(id, accountability) => {
    const service = await getUsersService(ctx, { accountability });
    if (typeof id === 'string') {
      const user = await service.readOne(id) as User;
      return user;
    }
    return id;
  }
}
  
export const generateRetrieveUserByEmail: FactoryFunction<User | null, [email: string, accountability: Accountability]> = (ctx) => {
  return async(email, accountability) => {
    const { knex } = await getUsersService(ctx, { accountability });
    if (email && typeof email === 'string' && email.includes('@')) {
      const user: User = await knex
      .select('id', 'role', 'status', 'password', 'email')
      .from('directus_users')
      .whereRaw(`LOWER(??) = ?`, ['email', email.toLowerCase()])
      .first();
      if (!user) return null;
      return user;
    }
    return null;
  }
}

