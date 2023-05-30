const path = require("path");

export default {
    root: path.resolve(__dirname, "src"),
    build: {
        outDir: "../dist",
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "src/index.html"),
                secondary: path.resolve(__dirname, "src/table.html"),
            },
        },
    },
    server: {
        port: 8080,
        hot: true,
    },
};
