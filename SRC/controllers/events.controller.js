import { eventsService } from '../services/events.service.js';

export const list = async (req, res, next) => {
  try {
    const resultado = await eventsService.getAllEvents(req.query);
    return res.status(200).json({ status: 'success', ...resultado });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const event = await eventsService.getEventById(req.params.id);
    return res.status(200).json({ status: 'success', payload: event });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const organizerId = req.user.id || req.user._id;
    const nuevoEvento = await eventsService.createEvent(req.body, organizerId);
    return res.status(201).json({ status: 'success', payload: nuevoEvento });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const modificado = await eventsService.updateEvent(req.params.id, req.body, req.user);
    return res.status(200).json({ status: 'success', payload: modificado });
  } catch (error) {
    next(error);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    const modificado = await eventsService.updateEventStatus(req.params.id, req.body.status, req.user);
    return res.status(200).json({ status: 'success', payload: modificado });
  } catch (error) {
    next(error);
  }
};
