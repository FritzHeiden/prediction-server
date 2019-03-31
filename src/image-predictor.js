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

  /**
   * Predicts a number from image data
   * @param {Buffer} buffer
   */
  async predictNumber(buffer) {
    // const image = await Jimp.read("./data/test.jpg");
    const image = await Jimp.read(buffer);

    // image.write(`./data/image-${Date.now()}.jpg`); // save unprocessed image
    const { width, height } = image.bitmap;
    image.crop(0, 0, width, width); // make image a square
    image.greyscale(); // desaturate
    image.contrast(1); // crank up the contrast to eliminate shadows
    image.invert(); // invert for the model to understand
    image.resize(28, 28); // resize so it fits into the model
    // image.write(`./data/image-${Date.now()}.jpg`); // save processed image

    // make 1 color channel out of 4 rgba
    const { data } = image.bitmap;
    const preparedData = [];
    for (let i = 0; i < data.length; i += 4) {
      preparedData.push(data[i] / 255); // normalize values for better prediction results
    }

    const tensor = tf.tensor2d([preparedData]); // put image on the gpu
    const result = this._model.predict(tensor);
    const index = await result.argMax(1); // get one hot encoded value
    const number = (await index.data())[0]; // read data from gpu
    return number;
  }
}

module.exports = ImagePredictor;
