const User = require('../models/user.model');

function createUserRepository() {
  return {
    findByEmail(email) {
      return User.findOne({ email }).select('+salt +passwordHash').lean().exec();
    },

    findById(id) {
      return User.findById(id).lean().exec();
    },

    async create(userData) {
      try {
        return await User.create(userData);
      } catch (error) {
        if (error.code === 11000) {
          return null;
        }
        throw error;
      }
    },
  };
}

module.exports = { createUserRepository };
