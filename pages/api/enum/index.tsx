import type { NextApiRequest, NextApiResponse } from 'next';
import apiRequest from '../../../src/lib/apiRequest';

function handler(_request: NextApiRequest, response: NextApiResponse) {
    apiRequest("enum", 'GET', {}, true, false)
        .then((res: any) => {
            if (res.success) response.send(res.data);
            else return Promise.reject(res);
        })
        .catch((err: any) => {
            response.status(400).send(err);
        });
}

export default handler;

export const maxDuration = 60;
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb',
        },
        externalResolver: true,
    },
}