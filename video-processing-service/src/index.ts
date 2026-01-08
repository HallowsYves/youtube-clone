import express, { response } from "express";

const app = express();
const port = 3000;

// .get has a request, and it has a response
app.get("/", (request, response) => {
    response.send("Hello World!")
});

app.listen(port, () => {
    console.log(`video processing servicel listening at http://localhost:${port}`);
});