import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { FormRow, Loader } from '../components';
import { resetPassword, verifyPasswordToken } from '../features/user/userSlice';
import { MessageTypes, toastMessage } from '../utils/toast';

const ResetPassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const dispatch = useDispatch();
  const { isLoading, isPasswordTokenValid, isResetPasswordSuccessful } =
    useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const passwordToken = searchParams.get('t');
    if (passwordToken) {
      dispatch(verifyPasswordToken(passwordToken));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (isResetPasswordSuccessful) {
      navigate('/login');
    }
  }, [isResetPasswordSuccessful, navigate]);

  const submitNewPassword = () => {
    if (!newPassword || !retypePassword) {
      toastMessage('Please provide new password', MessageTypes.ERROR);
      return;
    }

    if (newPassword.trim() !== retypePassword.trim()) {
      toastMessage('The two passwords do not match', MessageTypes.ERROR);
      return;
    }

    const info = {
      passwordToken: searchParams.get('t'),
      newPassword,
    };
    dispatch(resetPassword(info));
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );
  }

  if (!isPasswordTokenValid) {
    return (
      <Wrapper>
        <p>invalid token</p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <FormRow
        type='password'
        name='new password'
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <FormRow
        type='password'
        name='retype password'
        value={retypePassword}
        onChange={(e) => setRetypePassword(e.target.value)}
      />
      <button onClick={submitNewPassword}>Reset Password</button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin: 0 auto;
`;

export default ResetPassword;
