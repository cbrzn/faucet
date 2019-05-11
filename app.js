import express from "express";
import morgan from "morgan";
import routes from "./routes";

const app = express();

const requestHeaders = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
};

const appUse = (a, b) => (b ? app.use(a, b) : app.use(a));

const expressObjects = [
  express.json(),
  express.urlencoded({ extended: false }),
  morgan("combined")
];

const toUse = [expressObjects, requestHeaders, routes]

toUse.forEach(object => appUse(object))

appUse("/", routes);

app.listen(process.env.PORT || 3000, () =>
  console.log(`App listening on port # ${process.env.PORT || 3000}`)
);