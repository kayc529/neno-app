import React, { useState } from 'react';
import styled from 'styled-components';
import { Logo, FormRow } from '../components';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loginUser, registerUser } from '../features/user/userSlice';

const initUserInput = {
  name: '',
  email: '',
  password: '',
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userInput, setUserInput] = useState(initUserInput);
  const { isLoading, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // console.log(user);

  const toggle = () => {
    setIsLogin((prev) => !prev);
    setUserInput(initUserInput);
  };

  const submitForm = (e) => {
    e.preventDefault();
    const { name, email, password } = userInput;

    if (!email || !password || (!isLogin && !name)) {
      console.log('Please fill in all the info');
      return;
    }

    //login or register
    if (isLogin) {
      const user = { email, password };
      dispatch(loginUser(user));
      return;
    }

    const user = { username: name, email, password };
    dispatch(registerUser(user));
  };

  const onValueChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    let temp = { ...userInput, [name]: value };
    setUserInput(temp);
  };

  if (user) {
    return <Navigate to='/' />;
  }

  return (
    <Wrapper>
      <Logo />
      <form>
        {isLogin || (
          <FormRow
            type='text'
            name='name'
            value={userInput.name}
            onChange={onValueChange}
          />
        )}

        <FormRow
          type='email'
          name='email'
          value={userInput.email}
          onChange={onValueChange}
        />
        <FormRow
          type='password'
          name='password'
          value={userInput.password}
          onChange={onValueChange}
        />
        <button className='primary-btn btn' onClick={submitForm}>
          {isLogin ? 'login' : 'register'}
        </button>
      </form>
      <div>
        <p>{isLogin ? 'New to Neno?' : 'Already had an account?'}</p>
        <button disabled={isLoading} onClick={toggle}>
          {isLogin ? 'register' : 'login'}
        </button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin: 0 auto;

  form {
    display: flex;
    flex-direction: column;
  }

  div {
    display: flex;
    margin-top: 20px;
  }

  div button {
    margin-left: 12px;
  }
`;

export default Login;
