import React from "react";
import { useStore } from "../../Store";
import paths from "../../paths";
import { Redirect } from "react-router-dom";

const RootPage: React.FC = () => {
  const { isLoggedIn } = useStore();
  return <Redirect to={isLoggedIn ? paths.home : paths.welcome} />;
};

export default RootPage;
