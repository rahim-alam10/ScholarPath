const { randomBytes, scrypt, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');
const { tokenTtlMs } = require('../config');

const scryptAsync = promisify(scrypt);

function createAuthService(userRepository) {
  const sessions = new Map();

  async function register({ email, password, name }) {
    const salt = randomBytes(16).toString('hex');
    const passwordHash = (await scryptAsync(password, salt, 64)).toString('hex');
    const user = await userRepository.create({
      email,
      name,
      salt,
      passwordHash,
    });
    return user;
  }

  async function authenticate(email, password) {
    const user = userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const passwordHash = await scryptAsync(password, user.salt, 64);
    const storedHash = Buffer.from(user.passwordHash, 'hex');
    return storedHash.length === passwordHash.length
      && timingSafeEqual(storedHash, passwordHash)
      ? user
      : null;
  }

  function createSession(user) {
    const token = randomBytes(32).toString('hex');
    sessions.set(token, {
      userId: user.id,
      expiresAt: Date.now() + tokenTtlMs,
    });
    return token;
  }

  function getUserForToken(token) {
    const session = sessions.get(token);
    if (!session || session.expiresAt <= Date.now()) {
      if (session) {
        sessions.delete(token);
      }
      return null;
    }
    return userRepository.findById(session.userId);
  }

  return { register, authenticate, createSession, getUserForToken };
}

function toPublicProfile(user) {
  return { id: user.id, email: user.email, name: user.name };
}

module.exports = { createAuthService, toPublicProfile };
