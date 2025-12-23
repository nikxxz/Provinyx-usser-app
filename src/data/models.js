
export const UserModel = {
  id: '',
  email: '',
  name: '',
  avatar: '',
  createdAt: null,
};

export const AuthResponseModel = {
  user: UserModel,
  token: '',
  refreshToken: '',
};


export const ApiResponseModel = {
  success: false,
  data: null,
  message: '',
  statusCode: 200,
};


export const ErrorResponseModel = {
  success: false,
  error: '',
  statusCode: 500,
  details: {},
};


export const PaginationModel = {
  page: 1,
  limit: 20,
  sort: 'createdAt',
  order: 'desc',
};


export const isValidUser = user => {
  return user && user.id && user.email && user.name;
};


export const isValidApiResponse = response => {
  return response && typeof response.success === 'boolean';
};
