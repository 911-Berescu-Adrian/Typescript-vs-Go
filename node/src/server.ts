const express = require("express");
const app = express();
const port = 1236;

app.get("/", (req: any, res: any) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
