const User = require('../models/user.model');
const AcademicProfile = require('../models/academicProfile.model');

function createUserRepository() {
  return {
    findByEmail(email) {
      return User.findOne({ email }).select('+salt +passwordHash').lean().exec();
    },

    findById(id) {
      return User.findById(id).lean().exec();
    },

    async create(userData, academicProfileData) {
      const session = await User.startSession();
      let createdUser;
      try {
        await session.withTransaction(async () => {
          [createdUser] = await User.create([userData], { session });
          if (academicProfileData) {
            await AcademicProfile.create(
              [{ user: createdUser._id, ...academicProfileData }],
              { session },
            );
          }
        });
        return {
          user: createdUser,
          academicProfile: academicProfileData
            ? await AcademicProfile.findOne({ user: createdUser._id }).lean().exec()
            : null,
        };
      } catch (error) {
        if (error.code === 11000) {
          return null;
        }
        throw error;
      } finally {
        await session.endSession();
      }
    },

    findAcademicProfile(userId) {
      return AcademicProfile.findOne({ user: userId }).lean().exec();
    },

  };
}

module.exports = { createUserRepository };
