import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import apiRequest from '../../../../src/lib/apiRequest';
import { RemoveNullValues } from '../../../../src/utility/removeNullValues';

async function handler(request: NextApiRequest, response: NextApiResponse) {
    const token = await getToken({ req: request });

    const body = JSON.parse(request.body);

    const endpoint = "player/layout";

    switch (body.action) {
        case 'create': {
            const data = {
                title: body.title
            }

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
        case 'get': {
            apiRequest(endpoint + "/" + body.id, 'GET', {}, true, true, token?.user.token)
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
            const data = RemoveNullValues({
                title: (typeof body.title !== "undefined") ? body.title : null,
                live: (typeof body.live !== "undefined") ? body.live : null,
            })

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
        case 'list': {

            const listLimitAndOrder =
                (body.limit !== null
                    ?
                    "/" + body.limit
                    :
                    ""
                )
                +
                (body.offset !== null
                    ?
                    "/" + body.offset
                    :
                    ""
                )


            apiRequest(endpoint + "/list" + listLimitAndOrder, 'GET', {}, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        case 'layoutRows': {
            apiRequest(endpoint + '/rows/' + body.id, 'GET', {}, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        case 'duplicate': {
            const data = RemoveNullValues({
                title: (typeof body.title !== "undefined") ? body.title : null,
            })

            apiRequest(endpoint + '/duplicate/' + body.id, 'POST', data, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        case 'getLive': {
            apiRequest(endpoint, 'GET', {}, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        case 'getPreview': {
            apiRequest(endpoint + "/preview/" + body.id, 'GET', {}, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        case 'orderLayout': {
            const data = RemoveNullValues({
                layout_row_ids: body.layoutRowIds ? body.layoutRowIds : null,
            })

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