import { Outlet } from "react-router";
import { Container } from "@mantine/core";

import Header from "../../components/Header";
import { LoadingScreen } from "./LoadingScreen";

function Root() {
  return (
    <>
      <Container maw={"100%"} mih={"10dvh"} p={0}>
        <Header />
        <Outlet />
      </Container>
      <LoadingScreen />
    </>
  );
}

export default Root;
