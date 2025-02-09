import { useState } from "react";

import { useNavigate } from "react-router";
import { TextInput, Group, Button, Container } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useAuthContext } from "../context/AuthContext";
import { useSiteStore } from "../Store";

import { API } from "../constant";
import { setToken } from "../helpers";

const SignUpPage = () => {
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
          label="Character name"
          placeholder="Character name"
          key={form.key("username")}
          {...form.getInputProps("username")}
        />
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

export default SignUpPage;
