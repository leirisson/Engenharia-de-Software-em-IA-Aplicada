// import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import type { Restaurant } from "./interfaces/Restaurant";
import type { User } from "./interfaces/User";
import { makeContext } from "./ml/makeContext";

function App() {
  useEffect(() => {
    async function run() {
      const urls = ["../src/data/restaurants.json", "../src/data/user.json"];
      const response = await Promise.all(urls.map((url) => fetch(url)));
      const [restaurants, users] = (await Promise.all(
        response.map((r) => r.json()),
      )) as [Restaurant[], User[]];

      const context = makeContext(restaurants, users);
      console.log("dimensions:", context.dimensions);
      // 3 + 5 cuisines + 4 neighborhoods = 12

      console.log("cuisineIndex:", context.cuisineIndex);
      // { italiano:0, japones:1, burger:2, frances:3, brasileiro:4 }

      console.log("neighborhoodIndex:", context.neighborhoodIndex);
      // { centro:0, jardins:1, "vila madalena":2, pinheiros:3 }
    }

    run();
  }, []);

  return (
    <>
      <h1>teste</h1>
    </>
  );
}

export default App;
