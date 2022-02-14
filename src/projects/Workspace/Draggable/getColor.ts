const COLORS = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];

function* makeGetColor() {
  let i = 0;
  while (true) {
    i++;
    yield COLORS[i % COLORS.length];
  }
  return '';
}

export const getColor: Generator<string, string, string> = makeGetColor();
