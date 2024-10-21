import { withAuth } from "next-auth/middleware";

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    {
        pages: {
            signIn: '/login',
        }
    }
)

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - static (static files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|static|favicon.ico|auth|reset).*)',
    ],
}
