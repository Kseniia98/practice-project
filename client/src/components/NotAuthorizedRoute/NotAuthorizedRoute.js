import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { onlyForNotAuthorize } from '../../actions/actionCreator';
import Spinner from '../Spinner/Spinner';

const NotAuthorizedRoute = (props) => {
  const userStore = useSelector((state) => state.userStore);
  const dispatch = useDispatch();

  const checkAuth = useCallback((data) => dispatch(onlyForNotAuthorize(data)), [dispatch]);

  useEffect(()=> {
    checkAuth();
  }, [checkAuth])

  if (userStore.isFetching) {
    return <Spinner mtop />;
  } if (!userStore.data) {
    return <Route {...props} />;
  }
  return <Redirect to='/' />;
}


export default NotAuthorizedRoute;
