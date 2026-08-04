// Base URL for build-time API calls.
//
// Defaults to the public API. Builds that run on the server itself must override
// this with the internal address (http://kepul-backend:8000), because the droplet
// cannot reach its own public IP — there is no NAT hairpin, so api.kepul.id times
// out from inside a container on that host.
export const API_BASE_URL = process.env.API_BASE_URL || "https://api.kepul.id";
