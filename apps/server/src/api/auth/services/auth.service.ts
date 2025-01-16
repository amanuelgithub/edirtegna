import { AppDataSource, UserEntity } from '@server/src/core/database';
import {
  IForgotPassword,
  ILogin,
  ILogout,
  IRefresh,
} from '@server/src/api/auth/dtos';

const ds = AppDataSource;

// export const authService = {
async function login(data: ILogin) {
  // TODO: implement
}

async function register(data: ILogin) {
  // TODO: implement
}

// forgot password
async function forgotPassword(data: IForgotPassword) {
  // TODO: implement
}

// refresh
async function refresh(data: IRefresh) {
  // TODO: implement
}

// profile
async function profile() {
  // TODO: implement
}

// logout
async function logout(data: ILogout) {
  // TODO: implement
}
// };

export const authService = {
  login,
  register,
  forgotPassword,
  refresh,
  profile,
  logout,
};
