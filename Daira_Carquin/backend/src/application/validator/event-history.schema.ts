import { z } from 'zod';

export const EventHistorySchema = z.object({
    status: z.string().optional(),
    call_id: z
        .string()
        .uuid({ message: 'call_id must be a valid UUID' })
        .optional(),
});
