import { eventsRepository } from '../repositories/events.repository.js';

class EventsService {
  async getAllEvents() {
    return await eventsRepository.getAll();
  }
}

export const eventsService = new EventsService();
