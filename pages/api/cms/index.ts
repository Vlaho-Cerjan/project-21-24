import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import apiRequest from '../../../src/lib/apiRequest';
import { RemoveNullValues } from '../../../src/utility/removeNullValues';

async function handler(request: NextApiRequest, response: NextApiResponse) {
    const token = await getToken({ req: request });

    const body = JSON.parse(request.body);

    const endpoint = "cms";

    switch (body.action) {
        case 'lock': {
            const data = {
                entity: body.entity,
            }

            apiRequest(endpoint + "/lock/" + body.id, 'POST', data, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        case 'unlock': {
            const data = {
            }

            apiRequest(endpoint + "/unlock/" + body.id, 'POST', data, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res);
                    else return Promise.reject(res);
                })
                .catch((err: any) => {
                    response.status(400).send(err);
                });
            break;
        }
        case 'activityList': {

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
                namespace: body.namespace ? body.namespace : null,
                user_id: body.userId ? body.userId : null,
                action: body.action ? body.action : null,
                entity_id: body.entityId ? body.entityId : null,
                entity_type: body.entityType ? body.entityType : null,
            })

            apiRequest(endpoint + "/list" + listLimitAndOrder, 'POST', data, true, true, token?.user.token)
                .then((res: any) => {
                    if (res.success) response.send(res.data);
                    else return Promise.reject(res);
                }
                )
                .catch((err: any) => {
                    response.status(400).send(err);
                }
                );
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