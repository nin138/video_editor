type ID = string | number;
type Fn = () => void;
type CB = {
  id: ID;
  callback: Fn;
};

class Loop {
  private loopId: number | undefined;
  private cbs: CB[] = [];
  constructor(fps: number) {
    this.loopId = window.setInterval(this.loop, 1000 / fps);
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

export const loop = new Loop(60);

class Loop2 {
  private loopId: number | undefined;
  private cbs: CB[] = [];
  constructor() {
    this.loopId = requestAnimationFrame(this.loop);
  }

  private loop = () => {
    this.cbs.forEach((it) => it.callback());
    requestAnimationFrame(this.loop);
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

export const loop2 = new Loop2();
