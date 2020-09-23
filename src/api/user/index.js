import routes from './routes';
import HttpBinder from '../../utils/http-binder';

export default app => HttpBinder(app, routes);
