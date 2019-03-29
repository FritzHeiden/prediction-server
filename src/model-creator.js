let tf;
const mnist = require("mnist");

const DEFAULT_LEARNING_RATE = 0.1;
const DEFAULT_EPOCHS = 10;
const DEFAULT_VALIDATION_SPLIT = 0.2;

const TOTAL_DATA_SETS = 10000;

async function generateModel({
  validationSplit = DEFAULT_VALIDATION_SPLIT,
  epochs = DEFAULT_EPOCHS,
  learningRate = DEFAULT_LEARNING_RATE
} = {}) {
  require("@tensorflow/tfjs-node");
  tf = require("@tensorflow/tfjs");

  const model = createModel(learningRate);
  await trainModel(model, { validationSplit, epochs });
  await model.save("file://./data/model");
}

async function trainModel(model, { validationSplit, epochs }) {
  const trainingDataSetCount = Math.floor(
    TOTAL_DATA_SETS * (1 - validationSplit)
  );
  const testDataSetCount = Math.floor(TOTAL_DATA_SETS * validationSplit);
  const { training: trainingSet, test: testSet } = mnist.set(
    trainingDataSetCount,
    testDataSetCount
  );
  const trainInput = tf.tensor2d(
    trainingSet.map(trainingData => trainingData.input)
  );
  const trainOutput = tf.tensor2d(
    trainingSet.map(trainingData => trainingData.output)
  );

  const testInput = tf.tensor2d(testSet.map(testData => testData.input));
  const testOutput = tf.tensor2d(testSet.map(testData => testData.output));

  await model.fit(trainInput, trainOutput, {
    epochs,
    validationData: [testInput, testOutput],
    shuffle: true
  });
}

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

module.exports = { generateModel };
