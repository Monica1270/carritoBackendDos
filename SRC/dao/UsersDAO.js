import User from '../models/user.js';

export class UsersDAO {
  async create(data) {
    const newUser = await User.create(data);
    return newUser.toObject ? newUser.toObject() : JSON.parse(JSON.stringify(newUser));
  }

  async getBy(filtro = {}) {
    return await User.findOne(filtro).lean();
  }
}
