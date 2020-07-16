import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointsmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsConstroller';

const appointmentsRouter = Router();
const appointmentsController = new AppointsmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required,
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);

appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
