import jwt from 'jsonwebtoken';
import User from '../../models/User.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/tokenUtils.js';

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while generating refresh and access token');
  }
};

export const registerUser = async ({ name, email, password }) => {
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, 'User with email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select('-password -refreshTokens');

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }

  return createdUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid user credentials');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select('-password -refreshTokens');

  return { user: loggedInUser, accessToken, refreshToken };
};

export const logoutUser = async (userId, refreshToken) => {
  await User.findByIdAndUpdate(
    userId,
    {
      $pull: { refreshTokens: refreshToken },
    },
    {
      new: true,
    }
  );
};

export const refreshAccessToken = async (oldRefreshToken) => {
  try {
    const decodedToken = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    if (!user.refreshTokens.includes(oldRefreshToken)) {
      throw new ApiError(401, 'Refresh token is expired or used');
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

    // Remove old refresh token and add new one
    await User.findByIdAndUpdate(user._id, {
      $pull: { refreshTokens: oldRefreshToken },
    });

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token');
  }
};

export const updateProfile = async (userId, { name, email, currency }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { name, email, currency } },
    { new: true, runValidators: true }
  ).select('-password -refreshTokens');

  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(401, 'Current password is incorrect');

  user.password = newPassword;
  await user.save();
};
