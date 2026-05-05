import { AppointmentService } from '../../services/appointmentService.ts';
import type { GraphState } from '../graph.ts';
import { z } from 'zod/v3'


const CancelRequiredFieldsSchema = z.object({
  professionalId: z.number({ required_error: "Profissinal ID is required", invalid_type_error: "Profissinal ID is required" }),
  datetime: z.string({ required_error: "Appointment datetime is required", invalid_type_error: "Appointment datetime is required" }),
  patientName: z.string({ required_error: "Patient name is required", invalid_type_error: "Patient name is required" }),
})

export function createCancellerNode(appointMentService: AppointmentService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`❌ Cancelling appointment...`);
    try {


      const validation = CancelRequiredFieldsSchema.safeParse(state)
      if (validation.error) {
        const errorMessages = validation.error.errors.map(e => e.message).join(', ')
        console.log(" 🚨 Erro de validação dos dados no cancelamento da consulta.")
        console.log(errorMessages)
        return {
          actionSuccess: false,
          actionError: errorMessages,
        }
      }

      appointMentService.cancelAppointment(
        validation.data.professionalId,
        validation.data.patientName,
        new Date(validation.data.datetime)
      )

      return {
        actionSuccess: true,
      };
      
    } catch (error) {
      console.log(`❌ Cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        ...state,
        actionSuccess: false,
        actionError: error instanceof Error ? error.message : 'Cancellation failed',
      };
    }
  };
}
