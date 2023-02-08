
export default async (request, context) => {
    const url = new URL(request.url);
    console.log(`Adding a custom cookie to the response for ${url}`);
    const session = context.cookies.get("cp-session");
    if (!session) {
        const id = Crypto.randomUUID();
        context.cookies.set({ name: "cp-session", value: id })
    }
    return await context.next();
};