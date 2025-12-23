let users = [
  {
    username: 'admin',
    password: 'admin',
    email: 'admin@gmail.com',
    phone: '9876543210',
  },
];

export const getUsers = () => users;

export const addUser = user => {
  users.push(user);
  return users;
};

export const findUserByUsername = username => {
  return users.find(u => u.username === username);
};

export const validateUser = (username, password) => {
  const user = findUserByUsername(username);
  return user && user.password === password ? user : null;
};
