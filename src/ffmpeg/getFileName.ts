function* makeClipName() {
  let i = 0;
  while (true) {
    i++;
    const date = new Date();
    yield 'clip' +
      i +
      '-' +
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getDate() +
      '__' +
      date.toLocaleTimeString() +
      '.mp4';
  }
  return '';
}

export const getClipName: Generator<string, string, string> = makeClipName();

function* makeOutputFileName() {
  let i = 0;
  while (true) {
    i++;
    const date = new Date();
    yield 'output' +
      i +
      '-' +
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getDate() +
      '__' +
      date.toLocaleTimeString() +
      '.mp4';
  }
  return '';
}

export const getOutputFileName: Generator<string, string, string> =
  makeOutputFileName();
