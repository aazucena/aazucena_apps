import directusHandler from './directus';
import routeHandler from './route';

const handlers = [
  routeHandler,
  directusHandler,
];

export {
  directusHandler,
  routeHandler,
};
export default handlers;
