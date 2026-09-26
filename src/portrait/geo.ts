import {CITIES, project} from '../components/Globe';
import {portraitGlobe} from './layout';

export {CITIES};

/** Screen position of a city on the portrait globe at frame f. */
export const portraitProject = (c: [number, number], f: number) => project(c[0], c[1], portraitGlobe(f));
