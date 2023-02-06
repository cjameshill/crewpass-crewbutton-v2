import flatten from "flat";

const remapData = (
    keys = {},
    data = {},
    toFlatten = true,
    unFlatten = true
) => {
    let modifiedData = toFlatten ? flatten(data) : data;

    const mappedData = (keys, data) =>
        Object.keys(data).reduce((acc, key) => {
            const renameObject = () => {
                if (keys[key] === undefined || keys[key] === null) {
                    return null;
                }

                return {
                    [keys[key]]: data[key],
                };
            };

            return Object.assign(acc, renameObject());
        }, {});

    return unFlatten
        ? flatten.unflatten(mappedData(keys, modifiedData))
        : mappedData(keys, modifiedData);
};

export function useGeneralComposable() {
    return {
        remapData
    }
}