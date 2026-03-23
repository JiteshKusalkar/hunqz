import { handlers as profileHandlers } from './profiles';
import { handlers as imageHandlers } from './images';

export const handlers = [...profileHandlers, ...imageHandlers];
