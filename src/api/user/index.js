import routes from './routes.js';
import HttpBinder from '../../utils/http-binder.js';

export default app => HttpBinder(app, routes);
