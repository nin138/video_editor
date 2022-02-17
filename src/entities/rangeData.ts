export class RangeData {
  private readonly _data: [number, number];

  public get data() {
    return this._data;
  }

  constructor(data: [number, number]) {
    this._data = data;
  }

  update(data: [number, number]) {
    return new RangeData(data);
  }

  private sorted() {
    return Array.from(this.data).sort((a, b) => a - b);
  }

  start() {
    return this.sorted()[0];
  }

  end() {
    return this.sorted()[1];
  }

  duration() {
    return this.end() - this.start();
  }
}
