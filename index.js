const PredictionServer = require("./src/core");
const ModelCreator = require("./src/model-creator");

const SERVE = "serve";
const MAKE_MODEL = "make_model";

(async () => {
  const startArguments = parseStartArguments();
  switch (startArguments.command) {
    case SERVE:
      const { port } = startArguments;
      await serve(port);
      break;
    case MAKE_MODEL:
      const { learningRate, epochs, validationSplit } = startArguments;
      await makeModel({ learningRate, epochs, validationSplit });
      break;
  }
})();

async function serve(port) {
  const predictionServer = new PredictionServer();

  print("Initializing prediction server ...");
  await predictionServer.initialize();
  println(" done.");

  print("Starting prediction server ...");
  const { ip, port: servePort } = await predictionServer.start(port);
  println(" done.");

  println(`Server running on ${ip}:${servePort}`);
}

async function makeModel(options) {
  return ModelCreator.generateModel(options);
}

function parseStartArguments() {
  const argumentStrings = process.argv;
  const parsedArguments = {
    applicationDirectoryPath: argumentStrings[1],
    command: SERVE
  };
  for (let i = 2; i < argumentStrings.length; i++) {
    const argument = argumentStrings[i];
    const value = argumentStrings[i + 1] || null;
    if (i === 2) {
      switch (argument) {
        case "serve":
          parsedArguments.command = SERVE;
          continue;
        case "make-model":
          parsedArguments.command = MAKE_MODEL;
          continue;
      }
    }

    if (parsedArguments.command === MAKE_MODEL) {
      switch (argument) {
        case "--learning-rate":
          if (!value)
            throw new Error("No value provided to option '--learning-rate'");
          const learningRate = parseFloat(value);
          if (isNaN(learningRate))
            throw new Error("Learning rate must be of type float");
          parsedArguments.learningRate = learningRate;
          i++;
          continue;
        case "--epochs":
          if (!value) throw new Error("No value provided to option '--epochs'");
          const epochs = parseInt(value);
          if (isNaN(epochs)) throw new Error("Epochs must be of type int");
          parsedArguments.epochs = epochs;
          i++;
          continue;
        case "--validation-split":
          if (!value)
            throw new Error("No value provided to option '--validation-split'");
          const validationSplit = parseFloat(value);
          if (isNaN(epochs))
            throw new Error("Validation split must be of type float");
          if (validationSplit > 1)
            throw new Error("Validation split must be between 0 and 1");
          parsedArguments.validationSplit = validationSplit;
          i++;
          continue;
      }
    }

    if (parsedArguments.command === SERVE) {
      switch (argument) {
        case "--port":
          if (!value) throw new Error("No value provided to option '--port'");
          const port = parseInt(value);
          if (isNaN(port)) throw new Error("Port must be of type int");
          parsedArguments.port = port;
          i++;
          continue;
      }
    }
  }
  return parsedArguments;
}

function print() {
  const args = [];
  Object.keys(arguments).forEach(index => args.push(arguments[index]));
  process.stdout.write(args.join(" "));
}

function println() {
  const args = [];
  Object.keys(arguments).forEach(index => args.push(arguments[index]));
  args.push("\n");
  process.stdout.write(args.join(" "));
}
