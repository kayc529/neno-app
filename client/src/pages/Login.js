import React, { useState } from 'react';
import styled from 'styled-components';
import { Logo, FormRow, Select } from '../components';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loginUser, registerUser } from '../features/user/userSlice';
import { securityQuestions } from '../utils/options';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toastMessage, MessageTypes } from '../utils/toast';

const initUserInput = {
  name: '',
  email: '',
  password: '',
  birthday: new Date(), //current date
  securityQuestion: '',
  securityAnswer: '',
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
    const {
      name,
      email,
      password,
      securityQuestion,
      securityAnswer,
      birthday,
    } = userInput;

    if (
      !email ||
      !password ||
      (!isLogin && (!name || !securityQuestion || !securityAnswer || !birthday))
    ) {
      toastMessage('Please fill in all the info', MessageTypes.ERROR);
      return;
    }

    //login or register
    if (isLogin) {
      const user = { email, password };
      dispatch(loginUser(user));
      return;
    }

    const user = {
      username: name,
      email,
      password,
      birthday: birthday.setHours(0, 0, 0, 0),
      securityQuestion,
      securityAnswer,
    };

    dispatch(registerUser(user));
  };

  const onValueChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    let temp = { ...userInput, [name]: value };
    setUserInput(temp);
  };

  const onBirthdayChange = (date) => {
    console.log(date);
    let temp = { ...userInput, birthday: date };
    setUserInput(temp);
  };

  const onOptionSelected = (e) => {
    let temp = { ...userInput, securityQuestion: e.target.value };
    setUserInput(temp);
  };

  if (user) {
    return <Navigate to='/' />;
  }

  return (
    <Wrapper>
      <Logo />
      <form className='login-form'>
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
        {isLogin || (
          <>
            <FormRow name='birthday' showLabelOnly={true} />
            <DatePicker
              selected={userInput.birthday}
              onChange={(date) => onBirthdayChange(date)}
            />
            <Select
              options={securityQuestions}
              onChange={onOptionSelected}
              value={userInput.securityQuestion}
              placeholder='Please choose a security question'
            />
            <FormRow
              type='text'
              name='securityAnswer'
              value={userInput.securityAnswer}
              onChange={onValueChange}
              showLabel={false}
            />
          </>
        )}
        <button className='primary-btn btn' onClick={submitForm}>
          {isLogin ? 'login' : 'register'}
        </button>
      </form>
      <div className='alt-option-container'>
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

  .login-form {
    display: flex;
    flex-direction: column;
  }

  .alt-option-container {
    display: flex;
    margin-top: 20px;
  }

  .alt-option-container button {
    margin-left: 12px;
  }
`;

export default Login;
