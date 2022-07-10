class GenericServerResponseForAll {
  constructor(responseObject) {
    for (const key in responseObject) {
      this[key] = responseObject[key];
    }
  }
}

export default GenericServerResponseForAll;
