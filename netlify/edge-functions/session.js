
export default async (request, context) => {
    const url = new URL(request.url);

    console.log(`Adding a custom cookie to the response for ${url}`);

    const response = await context.next();
    response.cookies.set({ name: "cp-session", value: "cp-session-id" })
    return response;
};