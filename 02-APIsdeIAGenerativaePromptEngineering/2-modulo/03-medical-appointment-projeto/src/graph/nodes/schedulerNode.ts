import { AppointmentService } from '../../services/appointmentService.ts';
import type { GraphState } from '../graph.ts';
import {z} from 'zod/v3'

const ScheduleRequiredFieldsSchema = z.object({
  professionalId: z.number({ required_error: "Profissinal ID is required", invalid_type_error: "Profissinal ID is required" }),
  datetime: z.string({ required_error: "Appointment datetime is required", invalid_type_error: "Appointment datetime is required" }),
  patientName: z.string({ required_error: "Patient name is required", invalid_type_error: "Patient name is required" }),
})


export function createSchedulerNode(appointMentService: AppointmentService) {
  return async (state: GraphState): Promise<Partial <GraphState>> => {
    console.log(`📅 Scheduling appointment...`);

    try {

      const validation = ScheduleRequiredFieldsSchema.safeParse(state)

      if(!validation.success){
        const errorMessages = validation.error.errors.map(e => e.message).join(', ')
        console.log(" 🚨 Erro de validação dos dados")
        console.log(errorMessages)
        return {
          actionSuccess: false,
          actionError: errorMessages,
        }
      }

      const appointment = appointMentService.bookAppointment(
        validation.data.professionalId, 
        new Date(validation.data.datetime),
        validation.data.patientName,
        state.reason ?? 'consulta geral',
      )


      console.log(`✅ Appointment scheduled successfully`);

      return {
        ...state,
        actionSuccess: true,
        appointmentData: appointment
      };
    } catch (error) {
      console.log(`❌ Scheduling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        ...state,
        actionSuccess: false,
        actionError: error instanceof Error ? error.message : 'Scheduling failed',
      };
    }
  };
}
