import express, { Express, Request, Response } from "express";
import https from 'https';

import signup from "./routes/auth/signup";
import login from "./routes/auth/login";
import mainListings from "./routes/listings/main-listings";
import otherListings from "./routes/listings/other-listings";
import { authenticated } from "./routes/auth/login";


const app: Express = express();

app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(express.urlencoded());


app.use("/", signup);
app.use("/", login);
app.use("/", mainListings);
app.use("/", otherListings);

app.use((_: Request, res: Response) => {
    res.status(404);
    if (!authenticated.auth){
        res.render("404", {authenticated: false, username: ""});
    }
    else{
        res.render("404", {authenticated: true, username: authenticated.name});
    }
    // comment
});

const DEV_PORT = 3003;
const PORT = process.env.PORT ?? DEV_PORT;

if (PORT === DEV_PORT) {
    // On dev port, we are using HTTP
    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
} else {
    https.createServer(app).listen(PORT, () => {
        console.log(`Server started at https://cappumerce.onrender.com`);
    });
}
