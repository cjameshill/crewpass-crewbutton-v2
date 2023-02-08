
export default async (request, context) => {
    // Set a cookie    
    context.cookies.set({
        name: "CP-Session",
        value: "cp-sessino",
    });
};