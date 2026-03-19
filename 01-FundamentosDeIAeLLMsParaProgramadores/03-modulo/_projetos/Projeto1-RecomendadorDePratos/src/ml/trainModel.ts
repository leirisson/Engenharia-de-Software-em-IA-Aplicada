import * as tf from '@tensorflow/tfjs'
import { makeContext } from '../ml/makecontext'
import { makeFeatureVector, makeLabel } from '../ml/makeFeatureVector'

// ── DATASET ────────────────────────────────────────────────
function makeDataSet(context: ReturnType<typeof makeContext>) {
    const { users, dishes } = context
    const X: number[][] = []
    const Y: number[] = []

    users.forEach(user => {
        dishes.forEach(dish => {
            X.push(makeFeatureVector(user, dish, context))
            Y.push(makeLabel(user, dish))
        })
    })

    console.log(`Dataset: ${X.length} exemplos`)
    // 10 users × 8 dishes = 80 exemplos

    console.log(`Positivos (curtiu):     ${Y.filter(y => y === 1).length}`)
    console.log(`Negativos (não curtiu): ${Y.filter(y => y === 0).length}`)

    return { X, Y }
}


// ── ARQUITETURA ────────────────────────────────────────────

function buildModel(dimensions: number): tf.Sequential {
    const model = tf.sequential()
    // camada 1 - de entrada
    model.add(tf.layers.dense({
        inputShape: [dimensions],
        units: 16,
        activation: 'relu'
    }))

    // camada 2 - oculta
    model.add(tf.layers.dense({
        units: 8,
        activation: 'relu'
    }))

    // ✅ camada 3 — saída (estava faltando!)
    model.add(tf.layers.dense({
        units: 1,           // um número: a probabilidade
        activation: 'sigmoid' // força saída entre 0 e 1
    }))

    // ✅ compile fica fora das camadas
    model.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy'],
    })

    return model
}


// ── TREINO ─────────────────────────────────────────────────
export type TrainProgress = {
    epoch: number
    epochs: number
    progress: number
}

export async function trainModel(
    context: ReturnType<typeof makeContext>,
    options?: { onProgress?: (progress: TrainProgress) => void }
) {
    const { X, Y } = makeDataSet(context)

    // ✅ valida antes de criar os tensores
    console.log('dimensions:', context.dimensions)
    console.log('X[0].length:', X[0].length)
    // os dois DEVEM ser iguais

    if (X[0].length !== context.dimensions) {
        throw new Error(
            `Vetor tem ${X[0].length} features mas dimensions é ${context.dimensions}`
        )
    }

    const xs = tf.tensor2d(X, [X.length, context.dimensions])
    const ys = tf.tensor2d(Y, [Y.length, 1])

    const model = buildModel(context.dimensions)
    const epochs = 50

    options?.onProgress?.({ epoch: 0, epochs, progress: 0 })

    await model.fit(xs, ys, {
        epochs,
        batchSize: 8,
        shuffle: true,
        validationSplit: 0.2,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                const loss = logs?.loss ?? 0
                const acc = logs?.acc ?? logs?.accuracy ?? 0
                const epochNumber = epoch + 1
                options?.onProgress?.({ epoch: epochNumber, epochs, progress: epochNumber / epochs })
                console.log(`Epoch ${epochNumber}/${epochs} — loss: ${loss.toFixed(4)} — acc: ${acc.toFixed(2)}`)
            }
        }
    })

    options?.onProgress?.({ epoch: epochs, epochs, progress: 1 })

    xs.dispose()
    ys.dispose()

    return model
}
