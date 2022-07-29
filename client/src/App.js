import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Error from './pages/Error';
import ForgetPassword from './pages/ForgetPassword';
import ProtectedRoute from './pages/ProtectedRoute';
import { DialogModal } from './components';
import { SharedLayout, Memos, EditMemo, Todos } from './pages/Dashboard';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <>
      {/* <DialogModal /> */}
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
