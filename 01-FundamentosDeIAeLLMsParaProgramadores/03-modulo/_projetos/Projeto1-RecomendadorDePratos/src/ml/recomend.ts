import * as tf from '@tensorflow/tfjs'
import type { makeContext } from '../ml/makecontext'
import { makeFeatureVector } from '../ml/makeFeatureVector'
import type { User, Dish } from '../ml/makecontext'



export async function recommend(
    user: User,
    context: ReturnType<typeof makeContext>,
    model: tf.Sequential
): Promise<{ dish: Dish, score: number }[]> {
    const results: { dish: Dish, score: number }[] = []

    for (const dish of context.dishes) {
        const vector = makeFeatureVector(user, dish, context)
        const input = tf.tensor2d([vector])
        const predicttion = model.predict(input) as tf.Tensor
        const score = (await predicttion.data())[0]

        input.dispose()
        predicttion.dispose()

        results.push({ dish, score })
    }

    // ordena do maior score para o menor
    return results.sort((a, b) => b.score - a.score)
}