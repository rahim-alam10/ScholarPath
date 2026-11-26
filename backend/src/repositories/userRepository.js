const { randomUUID } = require('node:crypto');
const { mkdir, readFile, rename, writeFile } = require('node:fs/promises');
const path = require('node:path');

async function createUserRepository(dataFile) {
  let users = [];
  let mutationQueue = Promise.resolve();

  try {
    users = JSON.parse(await readFile(dataFile, 'utf8'));
    if (!Array.isArray(users)) {
      throw new Error('User data must be a JSON array.');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  async function persist(nextUsers) {
    await mkdir(path.dirname(dataFile), { recursive: true });
    const temporaryFile = `${dataFile}.${randomUUID()}.tmp`;
    await writeFile(temporaryFile, JSON.stringify(nextUsers, null, 2), { mode: 0o600 });
    await rename(temporaryFile, dataFile);
  }

  function serializeMutation(operation) {
    const result = mutationQueue.then(operation);
    mutationQueue = result.then(() => undefined, () => undefined);
    return result;
  }

  return {
    findByEmail(email) {
      return users.find((user) => user.email === email) ?? null;
    },

    findById(id) {
      return users.find((user) => user.id === id) ?? null;
    },

    create(userData) {
      return serializeMutation(async () => {
        if (users.some((user) => user.email === userData.email)) {
          return null;
        }

        const user = { id: randomUUID(), ...userData };
        const nextUsers = [...users, user];
        await persist(nextUsers);
        users = nextUsers;
        return user;
      });
    },
  };
}

module.exports = { createUserRepository };
