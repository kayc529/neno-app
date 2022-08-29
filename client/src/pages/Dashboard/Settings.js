import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Container, FormRow } from '../../components';
import { getProfile, updateProfile } from '../../features/user/userSlice';
import { MessageTypes, toastMessage } from '../../utils/toast';
import { fieldLengths } from '../../constants';
const Settings = () => {
  const { user, isCurrentPasswordValid } = useSelector((state) => state.user);
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

  useEffect(() => {
    if (isCurrentPasswordValid) {
      updatePassword();
    }
  }, [isCurrentPasswordValid, dispatch]);

  const updatePassword = () => {
    //prevent unnecessary update if the current and new passwords are the same
    if (currentPassword === newPassword) {
      toastMessage(
        'New password cannot be the same as the current one',
        MessageTypes.ERROR
      );
      return;
    }
    //update current password
    dispatch(updateProfile(newPassword));
  };

  const onDataChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    let temp = { ...data, [name]: value.trim() };
    setData(temp);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (
      !currentPassword ||
      (username === user.username && newPassword.length === 0)
    ) {
      console.log('nothing to update');
      return;
    }

    // validate fields
    if (username.length < fieldLengths.USERNAME_LENGTH) {
      toastMessage(
        `Your username must be at least ${fieldLengths.USERNAME_LENGTH} characters in length`,
        MessageTypes.ERROR
      );
      return;
    } else if (currentPassword.length < fieldLengths.PASSWORD_LENGTH) {
      toastMessage(
        `Your password must be at least ${fieldLengths.USERNAME_LENGTH} characters in length`,
        MessageTypes.ERROR
      );
      return;
    } else if (newPassword.length < fieldLengths.PASSWORD_LENGTH) {
      toastMessage(
        `Your password must be at least ${fieldLengths.USERNAME_LENGTH} characters in length`,
        MessageTypes.ERROR
      );
      return;
    } else if (newPassword !== retypePassword) {
      toastMessage('The two passwords does not match', MessageTypes.ERROR);
      return;
    }

    //verify current password
    dispatch(
      updateProfile({ currentPassword, newUsername: username, newPassword })
    );
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
