import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Container, FormRow } from '../../components';
import {
  getProfile,
  verifyCurrentPassword,
} from '../../features/user/userSlice';
import { MessageTypes, toastMessage } from '../../utils/toast';
const Settings = () => {
  const { user } = useSelector((state) => state.user);
  const initState = {
    username: user.username,
    currentPassword: '',
    newPassword: '',
    retypePassword: '',
  };
  const [data, setData] = useState(initState);
  const { username, currentPassword, newPassword, retypePassword } = data;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const onDataChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    let temp = { ...data, [name]: value.trim() };
    setData(temp);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    //check password fields
    if (currentPassword.length < 6) {
      toastMessage(
        'Your current password must be at least 6 characters in length',
        MessageTypes.ERROR
      );
      return;
    } else if (newPassword.length < 6) {
      toastMessage(
        'Your new password must be at least 6 characters in length',
        MessageTypes.ERROR
      );
      return;
    } else if (newPassword !== retypePassword) {
      toastMessage('The two passwords does not match', MessageTypes.ERROR);
      return;
    }

    //verify current password
    await dispatch(verifyCurrentPassword(currentPassword));
    if (currentPassword === newPassword) {
      toastMessage('You cannot set the same password', MessageTypes.ERROR);
      return;
    }
    //update profile
  };

  return (
    <Wrapper>
      <Container>
        <form>
          <FormRow
            type='text'
            name='username'
            displayName='Username'
            value={username}
            onChange={onDataChange}
          />
          <FormRow
            type='text'
            name='email'
            value={user.email}
            onChange={null}
            disabled
          />
          <FormRow
            type='password'
            name='currentPassword'
            displayName='current password'
            value={currentPassword}
            onChange={onDataChange}
          />
          <FormRow
            type='password'
            name='newPassword'
            displayName='New Password'
            value={newPassword}
            onChange={onDataChange}
          />
          <FormRow
            type='password'
            name='retypePassword'
            displayName='Retype Password'
            value={retypePassword}
            onChange={onDataChange}
          />
          <button className='btn primary-btn' onClick={handleUpdate}>
            Update
          </button>
        </form>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.main``;

export default Settings;
