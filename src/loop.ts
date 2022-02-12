type ID = string | number;
type Fn = () => void;
type CB = {
  id: ID;
  callback: Fn;
};

class Loop {
  private loopId: number | undefined;
  private cbs: CB[] = [];
  constructor(interval: number) {
    this.loopId = window.setInterval(this.loop, interval);
  }

  private loop = () => {
    this.cbs.forEach((it) => it.callback());
  };

  add = (id: ID, callback: Fn) => {
    this.cbs.push({
      id,
      callback,
    });
  };

  remove = (id: ID) => {
    this.cbs = this.cbs.filter((it) => it.id !== id);
  };

  stop = () => {
    if (!this.loopId) return;
    clearInterval(this.loopId);
    this.loopId = undefined;
  };
}

export const loop = new Loop(10);
