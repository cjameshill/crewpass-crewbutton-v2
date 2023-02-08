
export default async (request, context) => {
    console.log("setting cookies");
    context.cookies.set({
        name: "CP-Session",
        value: "cp-sessino",
    });
    const message = `Cookie has been set.`;

    return new Response(message);
};