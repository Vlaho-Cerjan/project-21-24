import type { NextApiRequest, NextApiResponse } from 'next';
import apiRequest from '../../../src/lib/apiRequest';

function handler(request: NextApiRequest, response: NextApiResponse) {
    const body = JSON.parse(request.body);
    apiRequest("auth/password-request", 'POST', { email: body.email }, true, false, null, undefined)
        .then((res: any) => {
            if (res.success) response.send(res.data);
            else return Promise.reject(res);
        })
        .catch((err: any) => {
            response.status(400).send(err);
        });
}

export default handler;

export const config = {
    api: {
        externalResolver: true,
    },
};