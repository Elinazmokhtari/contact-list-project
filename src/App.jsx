// App.jsx
import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Contacts from "./pages/Contacts";
import CreateContact from "./pages/CreateContact";
import SingleContact from "./pages/SingleContact";
import ContactForm from "./components/ContactForm";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function HomeRedirect() {
  const token = localStorage.getItem("token");
  return <Navigate to={token ? "/contacts" : "/login"} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/contacts"
        element={
          <PrivateRoute>
            <Contacts />
          </PrivateRoute>
        }
      />

      <Route
        path="/create_contact"
        element={
          <PrivateRoute>
            <CreateContact />
          </PrivateRoute>
        }
      />

      <Route
        path="/single_contact/:id"
        element={
          <PrivateRoute>
            <SingleContact />
          </PrivateRoute>
        }
      />

      <Route
        path="/edit_contact/:id"
        element={
          <PrivateRoute>
            <ContactForm />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
