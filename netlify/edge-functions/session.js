
export default async (request, context) => {
    const url = new URL(request.url);

    if (url.searchParams.get("method") !== "set-response-header") {
        return context.next();
    }

    console.log(`Adding a custom header to the response for ${url}`);

    const response = await context.next();
    response.headers.set("X-Your-Custom-Header", "Your custom header value");
    return response;
};