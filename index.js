import "dotenv/config";
import express from "express";
import admin from "firebase-admin";
import md5 from "md5";
import morgan from "morgan";

const app = express();
const port = 8080;
app.use(morgan("dev"));

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://cvreplayermgmt-default-rtdb.firebaseio.com/",
});
const rootRef = admin.database().ref();

app.get("/", (req, res) => {
  res.send(
    // `<form action="./payload"><input type = "submit" value = "Click me for current data!" /></form ><form action="./sample"><input type = "submit" value = "Click me for sample data." /></form >`
    `<button onclick="location.href='/payload'" type="button">Click me for current data from the website!</button><button onclick="location.href='/sample'" type="button">Click me for stored sample data.</button>`
  );
});

app.get("/payload", async (req, res) => {
  const payload = {
    "Beat Saber D1": {},
    "Beat Saber D2": {},
  };

  await rootRef.once("value").then((dataSnap) => {
    const obj = dataSnap.val();
    for (let UID in obj) {
      try {
        for (let team in obj[UID].roster["Beat Saber"]) {
          let players = {};
          for (let player in obj[UID].roster["Beat Saber"][team].players) {
            let tag = obj[UID].roster["Beat Saber"][team].players[player].tag;
            players[tag] = {
              SSID: obj[UID].roster["Beat Saber"][team].players[player].SSID,
              streamID: md5(tag),
            };
          }
          payload[`Beat Saber ${obj[UID].roster["Beat Saber"][team].type}`][
            team
          ] = players;
        }
      } finally {
        continue;
      }
    }
  });

  res.json(payload);
});

app.get("/sample", (req, res) => {
  res.download("payload.json");
});

app.listen(port, () => {
  console.log(`Service listening on http://localhost:${port}.`);
});
