import { Answer, WebHook } from "../types/index";
import { webhookUrl } from "../config.json";
import * as fs from "fs";
import { DBFiles, saveAnswersIds } from "./files";

export class Channel {
  token: string;
  constructor(token: string) {
    this.token = token;
  }

  async checkHealth() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${this.token}`,
      },
    };

    const responseRaw = await fetch("https://gate.whapi.cloud/health", options);
    const response = await responseRaw.json();
    if (response.status.text !== "AUTH") throw "Channel not auth";
  }

  async sendMessage(to: string, body: string): Promise<boolean> {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ typing_time: 0, to, body }),
    };

    const responseRaw = await fetch(
      "https://gate.whapi.cloud/messages/text",
      options
    );
    const response = await responseRaw.json();
    return response.sent;
  }

  async sendPoll(to: string, title: string, answers: string[], count?: number) {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        options: answers,
        to,
        title,
        view_once: true,
        count: count || 1,
      }),
    };

    const responseRaw = await fetch(
      "https://gate.whapi.cloud/messages/poll",
      options
    );
    const response = await responseRaw.json();

    const answersId: Answer[] = response.message.poll.results;
    saveAnswersIds(answersId);
  }

  async setWebHook(): Promise<boolean> {
    const fullWebhookUrl = webhookUrl + "/hook";
    const currentHooks = await this.getWebHooks();
    if (currentHooks.find((elem) => elem.url === fullWebhookUrl)) return true;
    const index = currentHooks.findIndex((elem) => elem.url.includes("ngrok"));
    if (index !== -1) currentHooks[index].url = fullWebhookUrl;
    else
      currentHooks.push({
        events: [{ type: "messages", method: "post" }],
        mode: "body",
        url: fullWebhookUrl,
      });
    const options = {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ webhooks: currentHooks }),
    };

    const responseRaw = await fetch(
      "https://gate.whapi.cloud/settings",
      options
    );
    if (responseRaw.status !== 200) return false;
    return true;
  }

  async getWebHooks(): Promise<WebHook[]> {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${this.token}`,
      },
    };

    const responseRaw = await fetch(
      "https://gate.whapi.cloud/settings",
      options
    );
    const response = await responseRaw.json();
    return response.webhooks;
  }
}
