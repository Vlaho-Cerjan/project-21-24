import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import apiRequest from '../../../../src/lib/apiRequest';
import { RemoveNullValues } from '../../../../src/utility/removeNullValues';

async function handler(request: NextApiRequest, response: NextApiResponse) {
    const token = await getToken({ req: request });

    const body = JSON.parse(request.body);

    const endpoint = "content/video";

    switch (body.action) {
        case 'create': {
            const data = {
            }

            apiRequest(endpoint + "/" + "music", 'POST', data, true, true, token?.user.token)
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
            apiRequest(endpoint + "/" + "music" + "/" + body.id, 'GET', {}, true, true, token?.user.token)
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
            const data = {
            }

            apiRequest(endpoint + "/" + "music" + "/" + body.id, 'PUT', data, true, true, token?.user.token)
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
            apiRequest(endpoint + "/" + "music" + "/" + body.id, 'DELETE', {}, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        case 'order': {
            const data = {
                free: body.free,
                playlist_ids: body.playlistIds,
            }

            apiRequest(endpoint + "/" + "music" + "/order", 'POST', data, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
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

            const data = RemoveNullValues({
                type: "external",
                active: body.active ? body.active : null,
                order: body.order ? body.order : null,
                search: body.search ? body.search : null,
                genres: body.genres ? body.genres : null,
                ratings: body.ratings ? body.ratings : null,
                decades: body.decades ? body.decades : null,
                owners: body.owners ? body.owners : null,
                artists: body.artists ? body.artists : null,
            })

            apiRequest(endpoint + "/list" + listLimitAndOrder, 'POST', data, true, true, token?.user.token)
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