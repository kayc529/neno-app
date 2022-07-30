import styled from 'styled-components';
import ReactModal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { toggleShowDialog } from '../features/user/userSlice';

const Dialog = ({ confirmCallback, closeCallback }) => {
  const { showDialog, dialogTitle, dialogMessage } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  const handleConfirm = () => {
    if (confirmCallback) {
      confirmCallback();
    }
  };

  const handleCancel = () => {
    if (closeCallback) {
      closeCallback();
    }
    dispatch(toggleShowDialog());
  };

  return (
    <ReactModal
      isOpen={showDialog}
      className='Modal'
      overlayClassName='Overlay'
    >
      <Wrapper>
        <h4 className='title'>{dialogTitle}</h4>
        <p className='message'>{dialogMessage}</p>
        <div className='btn-container'>
          <button className='btn secondary-btn' onClick={handleCancel}>
            Cancel
          </button>
          <button className='btn primary-btn' onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </Wrapper>
    </ReactModal>
  );
};

const Wrapper = styled.article`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px 30px 20px 30px;
  align-items: center;

  .title {
    text-align: center;
    margin: 0;
  }

  .message {
    text-align: center;
    padding: 20px 0;
    margin: 0;
  }

  .btn-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50%;
    min-width: 300px;
    margin: 0 auto;
  }
`;

export default Dialog;
