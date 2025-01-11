import { useState } from "react";

import { Link, useNavigate } from "react-router";

import { useAuthContext } from "../../context/AuthContext";

import { API } from "../../constant";
import { setToken } from "../../helpers";

const SignUp = () => {
  const navigate = useNavigate();

  const { setUser } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (data?.error) {
        throw data?.error;
      } else {
        // set the token
        setToken(data.jwt);

        // set the user
        setUser(data.user);

        navigate("/profile", { replace: true });
      }
    } catch (error) {
      console.error(error);
      setError(error?.message ?? "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={onFinish}>
        <input placeholder="Username" />
        <input placeholder="Email address" />

        <input placeholder="Password" />

        <button type="submit">Submit {isLoading && "loading"}</button>
      </form>
      <p>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </>
  );
};

export default SignUp;
