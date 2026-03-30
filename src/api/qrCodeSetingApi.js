import { post, get, patch, deleteRequest } from './restApi';

export const getQrCodeSettings = (payload) => {
    return get('qr-code-setting/get-all', { ...payload });
}
