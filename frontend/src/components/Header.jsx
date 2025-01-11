import { useNavigate, Link } from "react-router";

import { useAuthContext } from "../context/AuthContext";

import { removeToken } from "../helpers";

const Header = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/signin", { replace: true });
  };

  return (
    <>
      {user ? (
        <>
          <Link to="/profile">{user.username}</Link>
          <Link onClick={handleLogout}>Logout</Link>
        </>
      ) : (
        <>
          <Link to="/">Home</Link>
          <Link to="/signin">Login</Link>
          <Link to="/signup">SignUp</Link>
          <Link to="/about">About</Link>
        </>
      )}
    </>
  );
};

export default Header;
