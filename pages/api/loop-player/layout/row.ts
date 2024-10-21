import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import apiRequest from '../../../../src/lib/apiRequest';
import { RemoveNullValues } from '../../../../src/utility/removeNullValues';

async function handler(request: NextApiRequest, response: NextApiResponse) {
    const token = await getToken({ req: request });

    const body = JSON.parse(request.body);

    const endpoint = "player/layout-row";

    switch (body.action) {
        case 'create': {
            body.type = body.type === "-1" ? null : body.type;

            const data = RemoveNullValues({
                layout_id: body.layoutId,
                title: body.title ? body.title : null,
            })

            data.type = typeof body.type !== "undefined" ? body.type : null;

            apiRequest(endpoint, 'POST', data, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        case 'update': {
            body.type = body.type === "-1" ? null : body.type;

            const data = RemoveNullValues({
                title: body.title ? body.title : null,
            })

            data.type = typeof body.type !== "undefined" ? body.type : null;

            apiRequest(endpoint + "/" + body.id, 'PUT', data, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        case 'delete': {
            apiRequest(endpoint + "/" + body.id, 'DELETE', {}, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        case 'clearLayoutItems': {
            apiRequest(endpoint + "/clear/" + body.id, 'DELETE', {}, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        case 'orderRowItems': {
            const data = {
                layout_item_ids: body.layoutItemIds,
            }

            apiRequest(endpoint + "/order/" + body.id, 'PUT', data, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        default: {
            response.status(400).send("unknownAction");
        }
    }
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