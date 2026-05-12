import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as authService from './auth.service.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
};

export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  return res.status(201).json(new ApiResponse(201, user, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

  return res
    .status(200)
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(
      new ApiResponse(
        200,
        { user, accessToken }, // Access token also in body for memory storage
        'User logged in successfully'
      )
    );
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  await authService.logoutUser(req.user._id, refreshToken);

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export const refresh = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  const { accessToken, refreshToken } = await authService.refreshAccessToken(oldRefreshToken);

  return res
    .status(200)
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(new ApiResponse(200, { accessToken }, 'Token refreshed successfully'));
});

export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, 'Current user fetched successfully'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, currency } = req.body;
  const user = await authService.updateProfile(req.user._id, { name, email, currency });
  return res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user._id, currentPassword, newPassword);
  return res.status(200).json(new ApiResponse(200, {}, 'Password changed successfully'));
});
