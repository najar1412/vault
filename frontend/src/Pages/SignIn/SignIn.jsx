import { useState } from "react";

import { Link, useNavigate } from "react-router";

import { useAuthContext } from "../../context/AuthContext";

import { API } from "../../constant";
import { setToken } from "../../helpers";

const SignIn = () => {
  const navigate = useNavigate();

  const { setUser } = useAuthContext();

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const value = {
        identifier: values.email,
        password: values.password,
      };
      const response = await fetch(`${API}/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
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
        <input placeholder="Email address" />

        <input placeholder="Password" />

        <button type="submit">Login {isLoading && "loading..."}</button>
      </form>
      <p>
        New to Social Cards? <Link to="/signup">Sign Up</Link>
      </p>
    </>
  );
};

export default SignIn;
