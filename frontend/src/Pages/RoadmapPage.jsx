import { useState } from "react";

import { Link, useNavigate } from "react-router";
import { useForm } from "@mantine/form";
import { TextInput, Group, Button } from "@mantine/core";

import { useAuthContext } from "../context/AuthContext";

import { API } from "../constant";
import { setToken } from "../helpers";

const RoadmapPage = () => {
  const navigate = useNavigate();
  const { setUser, user } = useAuthContext();

  return (
    <>
      <p>Road map</p>
    </>
  );
};

export default RoadmapPage;
