import { notification } from 'antd';

export function showErrorMessage(message: string, description: string) {
    notification.error({
        message: message,
        description: description,
        placement: "topLeft",
    })
};