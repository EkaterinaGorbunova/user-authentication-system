const database: Express.User[] = [
  {
    id: '1',
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    role: 'user'
  },
  {
    id: '2',
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    role: 'user'
  },
  {
    id: '3',
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    role: 'admin'
  },
];

const userModel = {
  database, // Expose the database array

  /* FIX ME (types) 😭 */
  findOne: (email: string): Express.User | null => {
    const user = database.find((user) => user.email === email);
    return user || null;
  },

  /* FIX ME (types) 😭 */
  findById: (id: string): Express.User | null => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user || null;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
};

export { database, userModel };
