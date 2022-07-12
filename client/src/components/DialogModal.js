import styled from 'styled-components';

const DialogModal = () => {
  const handleConfirm = () => {
    console.log('confirm');
  };

  const handleCancel = () => {
    console.log('cancel');
  };

  return (
    <Wrapper>
      <div className='shade'>
        <div className='dialog-box'>
          <p></p>
          <div className='btn-container'>
            <button className='btn secondary-btn' onClick={handleCancel}>
              Cancel
            </button>
            <button className='btn primary-btn' onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.article`
  .shade {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .dialog-box {
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 12px;
    min-width: 400px;
    width: 40%;
    padding: 24px;
    margin: 20% auto 0 auto;
    align-items: center;
    z-index: 10;
  }

  .dialog-box p {
    margin: 24px 0;
    font-size: 18px;
    text-align: center;
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

export default DialogModal;
