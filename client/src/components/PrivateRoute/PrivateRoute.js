import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { getUserAction } from '../../actions/actionCreator';
import Spinner from '../Spinner/Spinner';

const PrivateRoute = (props) => {
  const dispatch = useDispatch();
  const userStore = useSelector((state) => state.userStore);

  const getUser  = useCallback((data) => dispatch(getUserAction(data)), [dispatch])

  useEffect(() => {
    if(userStore.data){
    getUser();
  }
  }, [getUser, userStore.data])
  
  if (userStore.error) return <Redirect to="/" />;

  return (
    <>
      {userStore.isFetching ? <Spinner mtop />
        : <Route {...props} />}
    </>
  );
}

export default PrivateRoute;
