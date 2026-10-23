// POST /api/request: the site's forms (/reserve, /contact). All the logic and the
// spam protection live in server/requestForm.js.
import { handleFormRequest } from '../../server/requestForm.js';

export const onRequestPost = ({ request, env }) => handleFormRequest(request, env);
