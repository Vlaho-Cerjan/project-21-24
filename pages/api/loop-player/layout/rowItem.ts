import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import apiRequest from '../../../../src/lib/apiRequest';
import { RemoveNullValues } from '../../../../src/utility/removeNullValues';

async function handler(request: NextApiRequest, response: NextApiResponse) {
    const token = await getToken({ req: request });

    const body = JSON.parse(request.body);

    const endpoint = "player/layout-item";

    switch (body.action) {
        case 'create': {
            const data = RemoveNullValues({
                title: body.title ? body.title : null,
                type: body.type,
                layout_row_id: body.rowId,
                content_id: body.contentId,
                description: body.description ? body.description : null,
                hide_title: body.hideTitle ? body.hideTitle : null,
                hide_description: body.hideDescription ? body.hideDescription : null,
                logo_data: body.logoData ? body.logoData : null,
                image_data: body.imageData ? body.imageData : null,
                title_display: !body.titleDisplay,
                description_display: !body.descriptionDisplay,
            })

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
            const data = RemoveNullValues({
                title: body.title ? body.title : null,
                type: body.type ? body.type : null,
                content_type: body.contentType ? body.contentType : null,
                content_id: body.contentId ? body.contentId : null,
                description: body.description ? body.description : null,
                hide_title: body.hideTitle ? body.hideTitle : null,
                hide_description: body.hideDescription ? body.hideDescription : null,
                logo_data: body.logoData ? body.logoData : null,
                image_data: body.imageData ? body.imageData : null,
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
        default: {
            response.status(400).send('unknownAction');
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