import express from "express";
import cors from "cors";
import http from "http";
import { Express } from "express-serve-static-core";
import * as fs from "fs";
import config from "../config.json";
import answers from "../answers.json"
import { Channel } from "./channel";
import { getAnswerFromId, getAnswerer, saveResult } from "./files";

const allowedOrigins = ["http://panel.whapi.cloud", "https://localhost"]; // allowed urls for get requests

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The domain is not allowed by CORS policy";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

export class ExpressServer {
  private readonly port: number;
  private readonly app: Express;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.setupMiddleware();
  }

  setupMiddleware() {
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.post("/hook", async (req, res) => { // hook endpoint
      const isMe = req.body.messages[0].from_me;
      const type = req.body.messages[0].type;
      const senderPhone = req.body.messages[0].chat_id.replace("@s.whatsapp.net", ""); // get sender phone
      const channel = new Channel(config.token);
      const answerer = getAnswerer(senderPhone);
      if(isMe){
        res.send("OK");
        return;
      }
      if(type === "text" && !answerer.is_polling){
        await channel.sendPoll(senderPhone, config.title, config.answers);
        answerer.is_polling = true;
      }
      if(type === "action" && !answerer.is_answer){
        const answerId = req.body.messages[0].action.votes[0];
        const answer = getAnswerFromId(answerId);
        await channel.sendMessage(senderPhone, `You selected the answer: "${answer}".`)
        answerer.is_answer = true;
        answerer.answer = answer;
      }
      saveResult(answerer);
      res.status(200).send("OK");
    });
  }

  launch() {
    this.app.use((req, res, next) => {
      res.setHeader("X-Powered-By", "Google Sheets Sender Script v1.0.0");
      const ip = req.headers["x-forwarded-for"] || req["remoteAddress"];
      next();
    });

    http.createServer(this.app).listen(this.port); // start server
    console.log(`Listening on port ${this.port}`);
  }
}
