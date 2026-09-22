import { NextRequest, NextResponse } from "next/server";
import { handlers } from "src/core/config/auth";
import { APP_BASE_PATH } from "src/core/utils/app-base-path";

export async function GET(request: NextRequest) {
    const response = await handlers.GET(request);

    if (!new URL(request.url).pathname.endsWith("/providers")) {
        return response;
    }

    const providers = await response.json();
    const requestUrl = new URL(request.url);
    const publicOrigin = process.env.NEXTAUTH_URL
        ? new URL(process.env.NEXTAUTH_URL).origin
        : requestUrl.origin;
    const publicAuthPrefix = `${publicOrigin}${APP_BASE_PATH}/api/auth`;

    for (const provider of Object.values(providers) as Array<
        Record<string, unknown>
    >) {
        for (const field of ["signinUrl", "callbackUrl"]) {
            const value = provider[field];
            if (typeof value !== "string") continue;

            const providerUrl = new URL(value);
            if (providerUrl.pathname.startsWith("/api/auth/")) {
                const suffix = providerUrl.pathname.slice("/api/auth".length);
                const rewrittenUrl = `${publicAuthPrefix}${suffix}${providerUrl.search}`;
                provider[field] = rewrittenUrl;
            }
        }
    }

    return NextResponse.json(providers, { status: response.status });
}

export const POST = handlers.POST;
