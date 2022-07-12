import { toast } from 'react-toastify';

export const MessageTypes = {
  DEFAULT: 'DEFAULT',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

export const toastMessage = (msg, messageType = MessageTypes.DEFAULT) => {
  switch (messageType) {
    case MessageTypes.SUCCESS: {
      toast.success(msg);
      break;
    }
    case MessageTypes.ERROR: {
      toast.error(msg);
      break;
    }
    case MessageTypes.DEFAULT:
    default: {
      console.log('waaaat');
      toast(msg);
      break;
    }
  }
};
