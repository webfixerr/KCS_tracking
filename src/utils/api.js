export const BASE_URL = 'https://erp.pdglobal.in/api';
export const ACTIVITY_TYPES = `${BASE_URL}/resource/PDG%20Activity%20type?fields=%5B%22name%22%5D&filters=%5B%5B%22name%22,%22in%22,%5B%22Audit%22,%22Charger%20Installation%22,%22PDG%20Maintenance%22%5D%5D%5D`;
export const WEATHER = `${BASE_URL}/resource/Weather%20type`;
export const ROOT_CAUSE = `${BASE_URL}/resource/Issue%20RCA`;
export const DAMAGE = `${BASE_URL}/resource/Any%20Physical%20Damage`;
export const SITE_NAME = `${BASE_URL}/resource/PDG%20Sites?fields=%5B%22site_name%22,%22street_address%22,%22city%22,%22state%22%5D
`;
export const STATUS_LIST = `${BASE_URL}/resource/Issues%20status`;
export const CHARGER_STATUS_LIST = `${BASE_URL}/resource/Charger%20installation%20status`;
export const VISIT_STATUS_LIST = `${BASE_URL}/resource/Charger%20maintenance%20status`;
export const AUDIT_STATUS_LIST = `${BASE_URL}/resource/Audit%20status`;
