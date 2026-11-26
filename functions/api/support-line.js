// GET /api/support-line: the direct support number for signed-in customers. All the logic, and why,
// lives in server/supportLine.js.
import { handleSupportLine } from '../../server/supportLine.js';

export const onRequest = ({ request, env }) => handleSupportLine(request, env);
