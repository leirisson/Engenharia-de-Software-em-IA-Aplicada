import "./App.css";
// em cada arquivo ml/
// import * as tf from '@tensorflow/tfjs'

// no App.tsx
import { makeContext } from "../src/ml/makecontext";
import { useEffect } from "react";
import { makeFeatureVector, makeLabel } from "./ml/makeFeatureVector";
import { trainModel } from "../src/ml/trainModel";
// import { recommend }   from './ml/recommend'

function App() {
  useEffect(() => {
    async function init() {
      try {
        const urls = ["../src/data/users.json", "../src/data/dishes.json"];

        const response = await Promise.all(urls.map((url) => fetch(url)));
        const [users, dishes] = await Promise.all(
          response.map((r) => r.json()),
        );

        const context = makeContext(dishes, users);

        const user = context.users[0];
        const dish = context.dishes[0];

        const vector = makeFeatureVector(user, dish, context);
        const label = makeLabel(user, dish);
        const model = await trainModel(context);

        console.log("modelo treinado ✅");
      } catch (error) {
        console.log(error);
      }
    }
    init();
  }, []);

  return (
    <>
      <h1>Ml com tensorFlow</h1>
    </>
  );
}

export default App;
