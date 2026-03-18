import "./App.css";
// em cada arquivo ml/
// import * as tf from '@tensorflow/tfjs'

// no App.tsx
import { makeContext } from "../src/ml/makecontext";
import { useEffect } from "react";
// import { trainModel }  from './ml/trainModel'
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
        console.log("dimensions:", context.dimensions);
        // deve printar: dimensions: 9
        // 3 numéricas + 4 categorias + 2 spicy = 9 ✅

        console.log("categoryIndex:", context.categoryIndex);
        // { pizza: 0, japones: 1, burger: 2, italiano: 3 }

        console.log("spicyIndex:", context.spicyIndex);
        // { nao: 0, sim: 1 }
        // // eslint-disable-next-line no-debugger
        // debugger
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
