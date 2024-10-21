import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import apiRequest from '../../../../src/lib/apiRequest';
import { RemoveNullValues } from '../../../../src/utility/removeNullValues';

async function handler(request: NextApiRequest, response: NextApiResponse) {
    const token = await getToken({ req: request });

    const body = JSON.parse(request.body);

    const endpoint = "player/playlist-mixer";

    switch (body.action) {
        case 'create': {
            const data = {
                name: body.name,
                description: body.description ? body.description : null,
                video_url: body.video_url ? body.videoUrl : null,
                image: body.image ? body.image : null,
                free: body.free ? body.free : null,
                videos: body.videos ? body.videos : null,
            }

            apiRequest(endpoint + "/" + body.type, 'POST', data, true, true, token?.user.token)
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
            const data = {
                name: body.name,
                description: body.description ? body.description : null,
                video_url: body.video_url ? body.videoUrl : null,
                image: body.image ? body.image : null,
                free: body.free ? body.free : null,
                active: body.active ? body.active : null,
                videos: body.videos ? body.videos : null,
            }

            apiRequest(endpoint + "/" + body.type + "/" + body.id, 'PUT', data, true, true, token?.user.token)
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
            apiRequest(endpoint + "/" + body.type + "/" + body.id, 'DELETE', {}, true, true, token?.user.token)
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
                schedule_ids: body.scheduleIds,
            }

            apiRequest(endpoint + "/" + body.type + "/order", 'POST', data, true, true, token?.user.token)
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
                type: body.type ? body.type : null,
                active: body.active ? body.active : null,
                tags: body.tags ? body.tags : null,
                free: false,
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
        case 'listFree': {

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
                type: body.type ? body.type : null,
                active: body.active ? body.active : null,
                tags: body.tags ? body.tags : null,
                free: false,
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
        case 'addTag': {
            const data = {
                tags: body.tags ? body.tags : null,
            }

            apiRequest(endpoint + "/" + body.type + "/" + body.id + "/tags", 'POST', data, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        case 'videoImageToPlaylistImage': {
            const data = {
                video_id: body.video_id,
            }

            apiRequest(endpoint + "/" + body.type + "/" + body.id + "/image", 'POST', data, true, true, token?.user.token)
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