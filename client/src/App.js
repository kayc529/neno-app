import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Error from './pages/Error';
import ForgetPassword from './pages/ForgetPassword';
import ProtectedRoute from './pages/ProtectedRoute';
import {
  SharedLayout,
  Memos,
  EditMemo,
  Todos,
  Archive,
  Settings,
} from './pages/Dashboard';
import ResetPassword from './pages/ResetPassword';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { MessageTypes, toastMessage } from './utils/toast';

function App() {
  const { errorMsg, successMsg, neutralMsg } = useSelector(
    (state) => state.messages
  );

  useEffect(() => {
    if (errorMsg) {
      toastMessage(errorMsg, MessageTypes.ERROR);
    }
    if (successMsg) {
      toastMessage(successMsg, MessageTypes.SUCCESS);
    }
    if (neutralMsg) {
      toastMessage(neutralMsg, MessageTypes.DEFAULT);
    }
  }, [errorMsg, successMsg, neutralMsg]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/home' element={<Landing />} />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Memos />} />
            <Route path='memos/:id' element={<EditMemo />} />
            <Route path='todos' element={<Todos />} />
            <Route path='archive' element={<Archive />} />
            <Route path='settings' element={<Settings />} />
          </Route>
          <Route path='login' element={<Login />} />
          <Route path='forget-password' element={<ForgetPassword />} />
          <Route path='reset-password' element={<ResetPassword />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
