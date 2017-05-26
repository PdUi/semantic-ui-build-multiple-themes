export const handleError: (err: Error) => void = (err: Error): void => {
    if (!!err) {
        console.error(err);

        return;
    }
};
