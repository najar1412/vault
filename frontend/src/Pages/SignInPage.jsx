import { useState } from "react";

import { useNavigate } from "react-router";
import { useForm } from "@mantine/form";
import { TextInput, Group, Button, Container } from "@mantine/core";

import { useAuthContext } from "../context/AuthContext";
import { useSiteStore } from "../Store";

import { API } from "../constant";
import { setToken } from "../helpers";

const SignInPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const { setIsLoading } = useSiteStore();
  const [error, setError] = useState("");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

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
        console.log("login successful");
        setToken(data.jwt);
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
    <Container>
      <form onSubmit={form.onSubmit((values) => onFinish(values))}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <TextInput
          withAsterisk
          label="password"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Container>
  );
};

export default SignInPage;
