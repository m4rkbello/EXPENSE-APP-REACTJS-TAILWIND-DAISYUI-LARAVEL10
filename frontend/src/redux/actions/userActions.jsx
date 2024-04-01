import api from '../../Services/Api.jsx';
import { useState } from 'react';

import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_FAILURE,
  CREATE_USER_SUCCESS,
  READ_USER_REQUEST,
  READ_USER_FAILURE,
  READ_USER_SUCCESS,
  UPDATE_USER_REQUEST,
  UPDATE_USER_FAILURE,
  UPDATE_USER_SUCCESS,
  DELETE_USER_REQUEST,
  DELETE_USER_FAILURE,
  DELETE_USER_SUCCESS,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  SCAN_QRCODE_REQUEST,
  SCAN_QRCODE_SUCCESS,
  SCAN_QRCODE_FAILURE
} from '../types/userTypes.jsx';

//FETCH STUDENT
export const fetchUserRequest = (loginResponse = null) => {
  return async dispatch => {
    console.log("Fetching students...");
    dispatch({ type: FETCH_USER_REQUEST });

    try {
      let response;
      if (loginResponse) {
        // Use the response data from the login API call
        response = { data: loginResponse };
        console.log("DATA LOGIN SUCCESS THEN EYANG E FETCH")
      } else {
        // Make a separate API call to fetch the user data
        response = await api.get('/api/users');
      }

      dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
      console.log("FETCH USER DATAS!", response.data);
    } catch (error) {
      console.error("Fetch students error:", error.message);
      dispatch({ type: FETCH_USER_FAILURE, payload: error.message });
    }
  };
};


export const fetchUserSuccess = (users) => ({
  type: FETCH_USER_SUCCESS,
  payload: users,
});

export const fetchUserFailure = (error) => ({
  type: FETCH_USER_FAILURE,
  payload: error,

});

export const registerUserPost = (userData) => {
  return async (dispatch) => {

    dispatch({ type: CREATE_USER_REQUEST });
    try {
      const response = await api.post('/api/register', userData);

      dispatch({ type: CREATE_USER_SUCCESS, payload: response.data });

    } catch (error) {
      dispatch({ type: CREATE_USER_FAILURE, payload: error.message });
      console.log("DATA")
    }
  };
};

//CREATE User 
export const loginUserPost = (userData) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_USER_REQUEST });
    try {
      const response = await api.post('/api/login', userData);
      dispatch({ type: CREATE_USER_SUCCESS, payload: response.data });
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user: response.data.user, token: response.data.token },
      });
      const { token } = response.data;

      // Save token to localStorage
      localStorage.setItem('M4rkbelloFullstackPersonalAccessToken', token);

      // Save token to cookies
      document.cookie = `M4rkbelloFullstackPersonalAccessToken=${token}; expires=${new Date(Date.now() + 86400 * 1000).toUTCString()}; path=/`;
      document.cookie = `M4rkBelloFullstackTime=${token}; expires=${new Date(Date.now() + 86400 * 1000).toUTCString()}; path=/`;

      // Clear local email and password (assuming these are state variables)
      setLocalEmail('');
      setLocalPassword('');

    } catch (error) {
      dispatch({ type: CREATE_USER_FAILURE, payload: error.message });
      dispatch({ type: LOGIN_USER_FAILURE, payload: error.message });
      console.log('Login error:', error);
    }
  };
};


export const postAndResponseQRCode = (email) => {
  return async (dispatch) => {
    dispatch({ type: SCAN_QRCODE_REQUEST });
    try {
      const response = await api.post('/api/scan-qrcode', email);
      dispatch({ type: SCAN_QRCODE_SUCCESS, payload: response.data });
      console.log("RESPONSE FROM QRCODE", response.data.token);

      const { token } = response.data;
      // Save token to localStorage
      localStorage.setItem('M4rkbelloFullstackPersonalAccessToken', token);
      // Save token to cookie
      document.cookie = `M4rkbelloFullstackPersonalAccessToken=${token}; expires=${new Date(Date.now() + 86400 * 1000).toUTCString()}; path=/`;
      document.cookie = `M4rkBelloFullstackTime=${token}; expires=${new Date(Date.now() + 86400 * 1000).toUTCString()}; path=/`;
    } catch (error) {
      dispatch({ type: SCAN_QRCODE_FAILURE, payload: error.message });
      console.log('Login error:', error);
    }
  };
};

export const findUserEmailPost = (userData) => {
  return async (dispatch) => {

    dispatch({ type: CREATE_USER_REQUEST });
    try {
      const response = api.post('/api/find-user', userData);

      dispatch({ type: CREATE_USER_SUCCESS, payload: response.data });
      console.log("RESPONSE SA LOGIN!", response.data);


    } catch (error) {
      dispatch({ type: CREATE_USER_FAILURE, payload: error.message });
      console.log("Login error:", error);
    }

  };
}

export const fetchLoginUser = () => {
  return async dispatch => {
    console.log("Fetching students...");
    dispatch({ type: FETCH_USER_REQUEST });
    try {
      const response = await api.get('/api/users');
      dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
      console.log("FETCH USER DATAS!", response.data);
    } catch (error) {
      console.error("Fetch students error:", error.message);
      dispatch({ type: FETCH_USER_FAILURE, payload: error.message });
    }
  };
};

export const createUserSuccess = () => ({
  type: CREATE_USER_SUCCESS,
});

export const createUserFailure = (error) => ({
  type: CREATE_USER_FAILURE,
  payload: error,
});

//READ User
export const readUserRequest = (id) => ({
  type: READ_USER_REQUEST,
  payload: id,
});

export const readUserSuccess = (user) => ({
  type: READ_USER_SUCCESS,
  payload: user,
});

export const readUserFailure = (error) => ({
  type: READ_USER_FAILURE,
  payload: error,
})


//UPDATE User
export const updateUserRequest = (id, newUser) => ({
  type: UPDATE_USER_REQUEST,
  payload: { id, newUser },
});

export const updateUserSuccess = () => ({
  type: UPDATE_USER_SUCCESS,
});

export const updateUserFailure = (error) => ({
  type: UPDATE_USER_FAILURE,
  payload: error,
});

//DELETE User
export const deleteUserRequest = (id) => ({
  type: DELETE_USER_REQUEST,
  payload: id,
});

export const deleteUserSuccess = () => ({
  type: DELETE_USER_SUCCESS,
});

export const deleteUserFailure = (error) => ({
  type: DELETE_USER_FAILURE,
  payload: error,
});











