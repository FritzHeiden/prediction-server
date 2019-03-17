const PredictionServer = require("./src/core");

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

const DEFAULT_PORT = 8080;

(async () => {
  const predictionServer = new PredictionServer();

  print("Initializing prediction server ...");
  await predictionServer.initialize();
  println(" done.");

  print("Starting prediction server ...");
  const { ip, port } = await predictionServer.start(DEFAULT_PORT);
  println(" done.");

  println(`Server running on ${ip}:${port}`);
})();
