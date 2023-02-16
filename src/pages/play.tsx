import React from "react";
import { useRouter } from "next/router";
import Error from "../components/Error";
import Loader from "../components/Loader";
import { api } from "../utils/api";
import { useQuery } from "react-query";

function Play() {
  const router = useRouter();
  const { data, error, isLoading } = useQuery("randomFacts", getGame);

  if (isLoading) return <Loader />;
  if (error) return <Error text={"Error: " + error} />;

  return <div>Play</div>;
}

export default Play;

const getGame = async () => {
  const res = await fetch("https://marcconrad.com/uob/smile/api.php");
  return res.json();
};
