import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { CustomDatePicker, FormRow } from '../components';
import 'react-datepicker/dist/react-datepicker.css';
import { MessageTypes, toastMessage } from '../utils/toast';
import {
  getSecurityQuestion,
  verifySecurityAnswer,
} from '../features/user/userSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [answer, setAnswer] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const dispatch = useDispatch();
  const { securityQuestion, passwordToken } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate('');

  useEffect(() => {
    if (passwordToken) {
      navigate(`/reset-password?t=${passwordToken}`);
    }
  }, [passwordToken, navigate]);

  const submitInfo = () => {
    if (!email || !birthday) {
      toastMessage(
        'Please fill in your email and birthday',
        MessageTypes.ERROR
      );
      return;
    }

    const info = { email, birthday };

    dispatch(getSecurityQuestion(info));
  };

  const submitAnswer = () => {
    if (!email || !answer) {
      toastMessage('Please provide email and answer', MessageTypes.ERROR);
      return;
    }

    const info = { email, securityAnswer: answer };
    dispatch(verifySecurityAnswer(info));
  };

  return (
    <Wrapper>
      <FormRow
        type='email'
        name='email'
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <FormRow name='birthday' showLabelOnly={true} />
      <CustomDatePicker
        selectedDate={birthday}
        onChange={(date) => setBirthday(date)}
      />
      <button className='btn btn-primary' onClick={submitInfo}>
        Submit
      </button>
      {securityQuestion && (
        <div>
          <FormRow
            type='text'
            name={securityQuestion}
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
          />
          <button onClick={submitAnswer}>Submit Answer</button>
        </div>
      )}
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

export default ForgetPassword;
