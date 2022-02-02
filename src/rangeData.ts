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

  start() {
    console.log(this.data);
    console.log(this.data.sort());
    return this.data.sort()[0];
  }

  end() {
    return this.data.sort()[1];
  }

  duration() {
    return this.end() - this.start();
  }
}
