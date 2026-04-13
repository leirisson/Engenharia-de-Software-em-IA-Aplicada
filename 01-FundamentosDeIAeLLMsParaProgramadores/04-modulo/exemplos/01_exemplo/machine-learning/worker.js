importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest');

const MODEL_PATH = `yolov5n_web_model/model.json`;
const LABELS_PATH = `yolov5n_web_model/labels.json`;
const INPUT_MODEL_DIMENSIONS = 640;
const CLASS_TRASHOLD = 0.4

let _labels = []
let _model = null

async function loadModelAndLabels() {
    await tf.ready()

    _labels = await (await fetch(LABELS_PATH)).json()
    _model = await tf.loadGraphModel(MODEL_PATH)


    // aquecimendo do modelo
    const dummyinput = tf.ones(_model.inputs[0].shape)
    await _model.execute(dummyinput)
    tf.dispose(dummyinput)

    postMessage({ type: 'model-load' })
}


function preprocessImage(input) {
    return tf.tidy(() => {
        const image = tf.browser.fromPixels(input)

        return tf.image.resizeBilinear(image, [INPUT_MODEL_DIMENSIONS, INPUT_MODEL_DIMENSIONS])
            .div(255)
            .expandDims(0)
    })
}


async function runInference(tensor) {
    const output = await _model.executeAsync(tensor)
    tf.dispose(tensor)


    const [box, scores, classes] = output.slice(0, 3)
    const [boxData, scoresData, classesData] = await Promise.all(
        [
            box.data(),
            scores.data(),
            classes.data()
        ]
    )

    output.forEach(element => element.dispose());

    return {
        boxes: boxData,
        scores: scoresData,
        classes: classesData
    }

}

// função geradora, para cada captura da imagem
function* processPrediction({ boxes, scores, classes }, width, height) {
    for (let index = 0; index < scores.length; index++) {
        if (scores[index] < CLASS_TRASHOLD) continue

        const label = _labels[classes[index]]

        if (label != 'kite') continue


        let [x1, y1, x2, y2] = boxes.slice(index * 4, (index + 1) * 4)

        x1 *= width
        x2 *= width
        y1 *= height
        y2 *= height

        // encontrando o centro do quadrado
        const boxWidth = x2 - x1
        const boxHeight = y2 - y1
        const centerX = x1 + boxWidth / 2
        const centerY = y1 + boxHeight / 2



        yield {
            x: centerX,
            y: centerY,
            score: (scores[index] * 100).toFixed(2)
        }
    }
}

loadModelAndLabels()

self.onmessage = async ({ data }) => {
    if (data.type !== 'predict') return
    if (!_model) return

    const input = preprocessImage(data.image)

    const { width, height } = data.image

    const inferenceResults = await runInference(input)

    for (const prediction of processPrediction(inferenceResults, width, height)) {
        postMessage({
            type: 'prediction',
           ...prediction
        });
    }




};

console.log('🧠 YOLOv5n Web Worker initialized');
