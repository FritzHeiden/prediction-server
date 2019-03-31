# Prediction Server

A server that predicts numbers in images using tensorflow. It provides a REST API for communication.

## Usage

### Requirements

- [Node.js](https://nodejs.org/en/) v11.13.0 (No other version tested)
- npm v6.9.0 (No other version tested)

### Pull project dependencies

Install project related dependencies by running the following command:

```
$ npm install
```

### Train Model

In order to run the server a model is required. The model can be created with the following command:

```
$ node index.js make-model
```

You can adjust basic training parameters by passing them to the `make-model` script:

---

| flag                         | default |
| ---------------------------- | ------- |
| `--learning-rate <float>`    | 0.001   |
| `--epochs <int>`             | 100     |
| `--validation-split <float>` | 0.2     |
| `--batch-size <int>`         | 128     |

### Running the server

To start the server, make sure a trained model is located in `data/model` and run the following command:

```
$ node index.js serve
```

or simply

```
$ node index.js
```

You can specify the port by passing the `--port <int>` parameter
