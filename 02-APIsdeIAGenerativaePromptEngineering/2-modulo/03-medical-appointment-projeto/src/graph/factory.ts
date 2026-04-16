import { config } from '../config.ts';
import { AppointmentService } from '../services/appointmentService.ts';
import { OpenRaouterService } from '../services/openRouterService.ts';
import { buildAppointmentGraph } from './graph.ts';

export function buildGraph() {
  const llmCliente = new OpenRaouterService(config)
  const appomimentService = new AppointmentService()
  return buildAppointmentGraph(llmCliente, appomimentService);
}

export const graph = async () => {
  return buildGraph();
};


