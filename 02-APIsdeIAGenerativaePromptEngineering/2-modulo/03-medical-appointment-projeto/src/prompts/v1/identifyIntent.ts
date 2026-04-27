import { z } from 'zod';

export const IntentSchema = z.object({
  intent: z.enum(['schedule', 'cancel', 'unknown']).describe('The user intent'),
  professionalId: z.number().nullable().optional().describe('ID of the medical professional'),
  professionalName: z.string().nullable().optional().describe('Name of the medical professional'),
  datetime: z.string().nullable().optional().describe('Appointment date and time in ISO format'),
  patientName: z.string().nullable().optional().describe('Patient name extracted from question'),
  reason: z.string().nullable().optional().describe('Reason for appointment (for scheduling)'),
});

export type IntentData = z.infer<typeof IntentSchema>;

export const getSystemPrompt = (professionals: any[]) => {
  return JSON.stringify({
    role: 'Intent Classifier for Medical Appointments',
    task: 'Identify user intent and extract all appointment-related details',
    professionals: professionals.map(p => ({ id: p.id, name: p.name, specialty: p.specialty })),
    current_date: new Date().toISOString(),
    rules: {
      schedule: {
        description: 'User wants to book/schedule a new appointment',
        keywords: ['schedule', 'book', 'appointment', 'I want to', 'make an appointment'],
        required_fields: ['professionalId', 'datetime', 'patientName'],
        optional_fields: ['reason']
      },
      cancel: {
        description: 'User wants to cancel an existing appointment',
        keywords: ['cancel', 'remove', 'delete', 'cancel my appointment'],
        required_fields: ['professionalId', 'datetime', 'patientName']
      },
      unknown: {
        description: 'Anything not related to scheduling or cancelling appointments',
        examples: ['weather questions', 'general info', 'unrelated queries']
      }
    },
    extraction_instructions: {
      professionalId: 'Match the professional name mentioned in the question to the ID from the professionals list. Use fuzzy matching.',
      professionalName: 'Extract the professional name as mentioned by the user',
      datetime: 'Parse relative dates (today=current_date, tomorrow=current_date+1day) and times. ALWAYS convert to ISO 8601 format (e.g. 2026-04-28T16:00:00.000Z). Use current_date as reference. REQUIRED for schedule and cancel intents.',
      patientName: 'Extract the patient name from the question. REQUIRED for schedule and cancel intents. Look for phrases like "I am X", "my name is X", "sou X", "me chamo X".',
      reason: 'Extract the reason/purpose for the appointment (only for scheduling)'
    },
    examples: [
      {
        input: 'I want to schedule with Dr. Alicio da Silva for tomorrow at 4pm for a check-up, my name is John Doe',
        output: { intent: 'schedule', professionalId: 1, professionalName: 'Dr. Alicio da Silva', datetime: '2026-02-12T16:00:00.000Z', patientName: 'John Doe', reason: 'check-up' }
      },
      {
        input: 'Hello, I am Maria Santos and I want to schedule an appointment with Dr. Alicio da Silva for tomorrow at 4pm for a regular check-up',
        output: { intent: 'schedule', professionalId: 1, professionalName: 'Dr. Alicio da Silva', datetime: '2026-02-12T16:00:00.000Z', patientName: 'Maria Santos', reason: 'regular check-up' }
      },
      {
        input: 'Cancel my appointment with Dr. Ana Pereira today at 11am, I am John Doe',
        output: { intent: 'cancel', professionalId: 2, professionalName: 'Dr. Ana Pereira', datetime: '2026-02-11T11:00:00.000Z', patientName: 'John Doe' }
      },
      {
        input: 'What is the weather today?',
        output: { intent: 'unknown' }
      }
    ]
  });
};

export const getUserPromptTemplate = (question: string) => {
  return JSON.stringify({
    question,
    instructions: [
      'Carefully analyze the question to determine the user intent',
      'Extract all relevant appointment details',
      'Convert dates and times to ISO format',
      'Match professional names to their IDs',
      'Return only the fields that are present in the question'
    ]
  });
};
