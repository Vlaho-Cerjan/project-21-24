import { rest } from 'msw';
import { user } from '../../types/next-auth';
import { Artist } from '../interfaces/content/artist';
import { LockedEntities } from '../store/slices/lockSlice';

export const testServerApi = 'http://localhost:3000/api/';
export const apiRequestPath = "https://content-management.project-dev.tv/api/";

export const testArtists: Artist[] = [
    {
        id: "1",
        name: 'test',
        biography: 'test',
        genre: {
            genre: ['test', 'test2'],
            subgenre: []
        },
        image: true,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: ""
    },
    {
        id: "2",
        name: 'test2',
        biography: 'test2',
        genre: {
            genre: ['test', 'test3'],
            subgenre: ['subtest']
        },
        image: true,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "3",
        name: 'test3',
        biography: 'test3',
        genre: {
            genre: ['test4', 'test5', 'test2'],
            subgenre: ['subtest2']
        },
        image: true,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "4",
        name: 'test4',
        biography: 'test4',
        genre: {
            genre: ['test6', 'test7', 'test', 'test2'],
            subgenre: ['subtest3', 'subtest2']
        },
        image: true,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: ""
    }
];

export const handlers = [
    // Handles a GET /test request

    rest.get(apiRequestPath + 'test', (req, res, ctx) => {
        return res(
            ctx.json({
                message: 'hello world',
            }),
        );
    }),

    // Handles a GET /enum request
    rest.get(testServerApi + 'enum', (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    id: '1',
                    name: 'enum1',
                },
                {
                    id: '2',
                    name: 'enum2',
                },
            ]),
        );
    }),

    // Handles a GET /auth/session request
    /*
    user is type of user from types/next-auth.d.ts
    */
    rest.get(testServerApi + 'auth/session', (req, res, ctx) => {
        return res(
            ctx.json({
                user: {
                    id: '1',
                    email: 'test@test.com',
                    first_name: 'test',
                    last_name: 'test',
                    roles: ['test'],
                    token: 'test',
                    job_title: 'test',
                    image: 1,
                    created_at: new Date().toISOString(),
                    updated_at: ''
                } as user,
            }),
        );
    }),

    // Handles a POST /cms request that receives a JSON response body with entity: string, id: string, action: string and returns a ok response success: true
    rest.post(testServerApi + 'cms', async (req, res, ctx) => {
        const body = await req.json();

        const lockedEntities = localStorage.getItem('lockedEntities');

        const lockedEntitiesObj: LockedEntities = lockedEntities ? JSON.parse(lockedEntities) : {};

        if(!body.entity || !body.id || !body.action || (body.action === "unlock" && Object.keys(lockedEntitiesObj).length === 0) ) {
            return res(
                ctx.status(400),
                ctx.json({
                    success: false,
                    message: 'Entity not found'
                }),
            );
        }
        return res(
            ctx.json({
                success: true
            }),
        );
    }),

    // Handles a POST request with Authorization header that reads 'Bearer test' and receives test: "test" and returns a ok response success: true
    rest.post(apiRequestPath + 'auth', async (req, res, ctx) => {
        // check if token is valid
        const token = req.headers.get('Authorization');

        if(!token || token !== 'Bearer test') {
            return res(
                ctx.status(400),
                ctx.json({
                    success: false,
                    message: 'Token not found'
                }),
            );
        }

        const body = await req.json();
        if(!body.test) {
            return res(
                ctx.status(400),
                ctx.json({
                    success: false,
                    message: 'Test not found'
                }),
            );
        }
        return res(
            ctx.json({
                success: true,
                test: body.test
            }),
        );
    }),

    // Handles a GET request with additional header for Cache-Control: max-age=60480 and checks if cache-control header is set to max-age=60480
    rest.get(apiRequestPath + 'addHeaders', async (req, res, ctx) => {
        const headers = req.headers;
        if(!headers.get('cache-control') && headers.get('cache-control') !== 'max-age=60480') {
            return res(
                ctx.status(400),
                ctx.json({
                    success: false,
                    message: 'Max-age not found'
                }),
            );
        }
        return res(
            ctx.json({
                success: true,
                data: headers.get('cache-control')
            }),
        );
    }),

    // Handles a POST request that fetches artists and returns an response with total number of artists "total" and artists "artists"
    // if the request fails because of missing authorization header, it returns a error message "invalid_user_token"
    
    rest.post(testServerApi + 'content/artists', async (req, res, ctx) => {
        const body = await req.json();

        // check if searchValue is set and if it is, filter the artists by name or genre and subgenre
        if(body.search) {
            const filteredArtists = testArtists.filter(artist => {
                if(artist.name.toLowerCase().includes(body.search.toLowerCase())) {
                    return true;
                }
                if(artist.genre.genre.some(genre => genre.toLowerCase().includes(body.search.toLowerCase()))) {
                    return true;
                }
                if(artist.genre.subgenre.some(subgenre => subgenre.toLowerCase().includes(body.search.toLowerCase()))) {
                    return true;
                }
                return false;
            });

            return res(
                ctx.json({
                    total: filteredArtists.length,
                    artists: filteredArtists
                }),
            );
        }

        return res(
            ctx.json({
                total: 4,
                artists: testArtists
            }),
        );
    }),
]