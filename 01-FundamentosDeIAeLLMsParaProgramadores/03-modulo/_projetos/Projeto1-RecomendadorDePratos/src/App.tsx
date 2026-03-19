import "./App.css";
// em cada arquivo ml/
// import * as tf from '@tensorflow/tfjs'

// no App.tsx
import { makeContext } from "../src/ml/makecontext";
import { useEffect } from "react";
import { makeFeatureVector, makeLabel } from "./ml/makeFeatureVector";
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

        const user = context.users[0]
        const dish = context.dishes[0]

        const vector = makeFeatureVector(user, dish, context);
        const label = makeLabel(user, dish)

        console.log("vetor:", vector)
        // esperado:
        // [
        //   0.13,  ← ageNorm    (25-22)/(45-22)
        //   0.09,  ← budgetNorm (30-25)/(80-25)
        //   0.27,  ← priceNorm  (35-18)/(65-18)
        //   1, 0, 0, 0,  ← pizza
        //   1, 0         ← nao
        // ]

        console.log("label:", label);
        // esperado: 1 (Ana curtiu Pizza Margherita ✅)

        console.log("tamanho do vetor:", vector.length)
        // esperado: 9 ← deve bater com dimensions
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
