import { post, patch } from './restApi';
import * as restGateway from './restGatewayApi'
export const login = (payload) => {
    return restGateway.post('auth/login', { ...payload });
}
export const register = (payload) => {
    return post('auth/register', { ...payload });
}
export const changePassword = (payload) => {
    return restGateway.post('auth/change-password', { ...payload });
}
export const changeResetPassword = (payload) => {
    return restGateway.patch('auth/reset-password', { ...payload });
}