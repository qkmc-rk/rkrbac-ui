import _axios from 'axios';
import {getToken, removeToken} from '@/utils/cookie';
import {message} from 'ant-design-vue';

const axios = _axios.create({
    baseURL: 'http://127.0.0.1:8521',
    timeout: 5000
});

axios.interceptors.request.use(config => {
    if (getToken()) {
        config.headers['token'] = getToken();
    }
    return config;
}, error => {
    return Promise.reject(error);
});

/**
 * 0：操作成功
 * 1000: 业务错误
 * 1001: 用户未登陆
 * 1002: 用户无权限
 */
axios.interceptors.response.use(response => {
    const responseData = response.data;
    const code = responseData.code;
    const msg = responseData.msg;
    const data = responseData.data;

    if (code == undefined || code == null) {
        message.error('返回值不标准');
        return Promise.reject();
    }

    if (code === 0) {
        return data;
    } else {
        if (code === 1000) {
            message.warning(msg);
        } else if (code === 1001) {
            message.error(msg, 1).then(() => {
                removeToken();
                location.reload();
            });
        } else if (code === 1002) {
            message.warning(msg);
        }
        return Promise.reject(new Error(msg));
    }
}, error => {
    message.error(error.message);
    return Promise.reject(error);
});

export default axios;
