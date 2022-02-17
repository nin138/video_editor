import { Drawable } from './drawable';
import { Animation } from './animation';

interface Lifetime {
  startTime: number;
  endTime: number;
}

export interface Node extends Lifetime {
  drawable: Drawable;
  animations: Animation[];
}
