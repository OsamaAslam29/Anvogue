export default class Promisable {
  static asPromise(promise) {
    return new Promise((resolve) => {
      promise.then(
        (res) => resolve([res, null]),
        (err) => resolve([null, err]),
      );
    });
  }
}
