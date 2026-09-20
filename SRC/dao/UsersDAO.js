import user from '../models/user.js';

export class UsersDAO {
  async create(data) {
    const newUser = await user.create(data);
    return newUser.toObject ? newUser.toObject() : JSON.parse(JSON.stringify(newUser));
  }

  async getBy(filtro = {}) {
    return await user.findOne(filtro).lean();
  }
}
