import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';

const ROLES = {
    "User": "user"
}

function App() {
  return (
      <Routes>
          <Route path="/" element={<Layout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="unauthorized" element={<Unauthorized />} />

              <Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}>
                <Route path="/" element={<Home />} />
              </Route>

              <Route path="*" element={<Missing />} />
          </Route>
      </Routes>
  );
}

export default App;