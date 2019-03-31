require("@tensorflow/tfjs-node");
const tf = require("@tensorflow/tfjs");
const Jimp = require("jimp");

/**
 * @module ImagePredictor
 */
class ImagePredictor {
  async loadModel() {
    this._model = await tf.loadLayersModel("file://./data/model/model.json");
  }

  async predictNumber(buffer) {
    // const image = await Jimp.read("./data/test.jpg");
    const image = await Jimp.read(buffer);

    // image.write(`./data/image-${Date.now()}.jpg`);
    const { width, height } = image.bitmap;
    image.crop(0, 0, width, width);
    image.greyscale();
    image.contrast(1);
    image.invert();
    image.resize(28, 28);
    image.write(`./data/image-${Date.now()}.jpg`);

    const { data } = image.bitmap;
    const preparedData = [];
    for (let i = 0; i < data.length; i += 4) {
      preparedData.push(data[i] / 255);
    }

    const tensor = tf.tensor2d([preparedData]);
    const result = this._model.predict(tensor);
    const index = await result.argMax(1);
    const number = (await index.data())[0];
    console.log(number);
    console.log(preparedData.length);
  }
}

module.exports = ImagePredictor;
