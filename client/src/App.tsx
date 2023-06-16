import Register from "./views/pages/Register";
import Login from "./views/pages/Login";
import Home from "./views/pages/Home";
import Layout from "./views/pages/Layout";
import Editor from "./views/pages/Editor";
import Admin from "./views/pages/Admin";
import Missing from "./views/pages/Missing";
import Unauthorized from "./views/pages/Unauthorized";
import Lounge from "./views/pages/Lounge";
import LinkPage from "./views/pages/LinkPage";
import RequireAuth from "./views/components/RequireAuth";
import PersistLogin from "./views/components/PersistLogin";
import { Routes, Route } from "react-router-dom";

const ROLES = {
  USER: 2001,
  EDITOR: 1984,
  ADMIN: 5150,
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.USER]} />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.EDITOR]} />}>
            <Route path="editor" element={<Editor />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>

          <Route
            element={<RequireAuth allowedRoles={[ROLES.EDITOR, ROLES.ADMIN]} />}
          >
            <Route path="lounge" element={<Lounge />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
