import HttpBinder from '../../utils/http-binder';
import routes from './routes';

export default app => HttpBinder(app, routes);
