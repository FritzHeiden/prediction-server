const Jimp = require("jimp");
const mnist = require("mnist");
require("@tensorflow/tfjs-node");
const tf = require("@tensorflow/tfjs");

const fileSystem = require("./file-system");

const { training: trainingSet, test: testSet } = mnist.set(8000, 2000);

const validationImage = testSet[0];
let imageData = [];
validationImage.input.forEach(
  value =>
    (imageData = imageData.concat([
      Math.floor(value * 255),
      Math.floor(value * 255),
      Math.floor(value * 255),
      255
    ]))
);

console.log(
  "CREATE IMAGE FOR NUMBER",
  validationImage.output.findIndex(value => value === 1)
);

const buffer = Buffer.from(imageData);

new Jimp({ data: buffer, width: 28, height: 28 }, (error, image) => {
  if (error) console.error(error);
  image.write("test.jpg");
});

const model = createModel(0.2);

const trainInput = tf.tensor2d(
  trainingSet.map(trainingData => trainingData.input)
);
const trainOutput = tf.tensor2d(
  trainingSet.map(trainingData => trainingData.output)
);

const testInput = tf.tensor2d(testSet.map(testData => testData.input));
const testOutput = tf.tensor2d(testSet.map(testData => testData.output));

(async () => {
  await model.fit(trainInput, trainOutput, {
    epochs: 50,
    validationData: [testInput, testOutput],
    shuffle: true
  });
  const testImage = tf.tensor2d([validationImage.input]);
  const results = model.predict(testImage);
  const index = results.argMax(1);
  const number = (await index.data())[0];
  console.log("PREDICTED NUMBER", number);
})();

function createModel(learningRate) {
  const model = tf.sequential();

  const hiddenLayer = tf.layers.dense({
    inputDim: 784,
    units: 20,
    activation: "sigmoid"
  });
  model.add(hiddenLayer);

  const outputLayer = tf.layers.dense({
    units: 10,
    activation: "softmax"
  });
  model.add(outputLayer);

  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: "categoricalCrossentropy"
  });
  return model;
}
