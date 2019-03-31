let tf;
const mnist = require("mnist");

const DEFAULT_LEARNING_RATE = 0.001;
const DEFAULT_EPOCHS = 100;
const DEFAULT_VALIDATION_SPLIT = 0.2;
const DEFAULT_BATCH_SIZE = 128;

const TOTAL_DATA_SETS = 10000;

async function generateModel({
  validationSplit = DEFAULT_VALIDATION_SPLIT,
  epochs = DEFAULT_EPOCHS,
  learningRate = DEFAULT_LEARNING_RATE,
  batchSize = DEFAULT_BATCH_SIZE
} = {}) {
  require("@tensorflow/tfjs-node");
  tf = require("@tensorflow/tfjs");

  const model = createModel(learningRate);
  await trainModel(model, { validationSplit, epochs, batchSize });
  await model.save("file://./data/model");
}

async function trainModel(model, { validationSplit, epochs, batchSize }) {
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
    shuffle: true,
    batchSize
  });
}

function createModel(learningRate) {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputDim: 784,
      units: 32,
      activation: "sigmoid"
    })
  );

  model.add(
    tf.layers.dense({
      units: 16,
      activation: "sigmoid"
    })
  );

  model.add(
    tf.layers.dense({
      units: 10,
      activation: "softmax"
    })
  );

  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: "categoricalCrossentropy"
  });
  return model;
}

module.exports = { generateModel };
