export default {
    getUrl() {
        // @ts-ignore
        return import.meta.env.VITE_BASE_URL;
    },
};
