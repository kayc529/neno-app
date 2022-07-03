import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Error from './pages/Error';
import ProtectedRoute from './pages/ProtectedRoute';
import { SharedLayout, Memos, EditMemo, Todos } from './pages/Dashboard';

function App() {
  return (
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
          <Route path='memo/:id' element={<EditMemo />} />
          <Route path='todos' element={<Todos />} />
        </Route>
        <Route path='login' element={<Login />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
