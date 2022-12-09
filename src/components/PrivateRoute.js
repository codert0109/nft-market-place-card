import React from 'react';
import { Route, Navigate  } from 'react-router-dom';
import {getUser} from "../services/user.service";

const PrivateRoute = ({role, children}) => {
  let currentUser = getUser();

  if (!localStorage.getItem('user')) {
    return <Navigate to="/login" replace />;
  }

  if(role && currentUser && currentUser.role != 1 && currentUser.role != role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export { PrivateRoute };
