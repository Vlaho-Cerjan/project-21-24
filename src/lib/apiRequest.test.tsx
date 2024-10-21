import axios from "axios";
import apiRequest from "./apiRequest";
import { describe, it } from 'vitest';
import { rest } from "msw";
import { apiRequestPath } from "../mocks/handlers";
import { server } from "../mocks/server";

describe("apiRequest", () => {
    it('tests simple apiRequest', async () => {
        expect(await apiRequest("test", "GET", {}, true, false)).toEqual({
            message: "hello world"
        });
    });

    it('tests if apiRequest return response without a data object', async () => {
        server.use(
            rest.get(apiRequestPath + "test", (req, res, ctx) => {
                return res(
                    ctx.status(200, "OK")
                )
            })
        );

        expect(await apiRequest("test", "GET", {}, true, false)).toEqual(
            expect.objectContaining({
                status: 200,
                statusText: "OK",
                data: ''
            }),
        )
    });

    it('tests apiRequest with auth', async () => {
        expect(await apiRequest("auth", "POST", { test: "test" }, true, true, "test")).toEqual({
            success: true,
            test: "test"
        });
    });

    it('tests apiRequest with auth and invalid token', async () => {
        expect(await apiRequest("auth", "POST", { test: "test" }, true, true, "invalid")).toEqual({
            success: false,
            message: "Token not found"
        });
    });

    it('tests apiRequest with additionalHeader Cache-Control: max-age=604800', async () => {
        expect(await apiRequest("addHeaders", "GET", {}, true, false, undefined, { "cache-control": "max-age=604800" })).toEqual({
            success: true,
            data: "max-age=604800"
        });
    });

    it('tests if apiRequest return correct errors', async () => {
        // return error with message
        server.use(
            rest.get(apiRequestPath + "test", (req, res, ctx) => {
                return res(
                    ctx.status(400),
                    ctx.json({
                        message: "Error occurred"
                    })
                )
            })
        );

        expect(await apiRequest("test", "GET", {}, true, false)).toEqual({
            message: "Error occurred"

        });

        // return error with message
        server.use(
            rest.get(apiRequestPath + "test", (req, res, ctx) => {
                return res(
                    ctx.status(400)
                )
            })
        );

        expect(await apiRequest("test", "GET", {}, true, false)).toEqual("An error occurred");

        // return error with message
        server.use(
            rest.get(apiRequestPath + "test", (req, res, ctx) => {
                return res(
                    ctx.status(400),
                    ctx.json({
                        message: "invalid_user_token"
                    })
                )
            })
        );

        expect(await apiRequest("test", "GET", {}, true, false)).toEqual({
            message: "invalid_user_token"
        });

        // abort by abortController
        server.use(
            rest.get(apiRequestPath + "test", (req, res, ctx) => {
                return res(
                    ctx.delay(100000)
                )
            })
        );

        // mock abort controller inside apiRequest

        const abortController = new AbortController();

        setTimeout(() => {
            abortController.abort();
        }, 100);

        expect(await apiRequest("test", "GET", {}, true, false, undefined, undefined, abortController)).toEqual("The user aborted the request");

        // return error without response
        server.use(
            rest.get(apiRequestPath + "test", (req, res, ctx) => {
                return res.networkError("Network Error");
            }
            )
        );

        expect(await apiRequest("test", "GET", {}, true, false)).toEqual("Network Error");
    });
});