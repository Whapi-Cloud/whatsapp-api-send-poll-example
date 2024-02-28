import * as fs from "fs";
import answers from "../answers.json";
import { Answer, Answerer } from "../types";

export enum DBFiles {
  "answers_file" = "answers.json",
  "result_file" = "result.json",
}

export function checkFiles() {
  // checking for files
  const keys = Object.keys(DBFiles);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const path = DBFiles[key];
    fs.writeFile(path, "[]", function (err) {
      if (err) throw err;
      console.log(`${key} is created succesfully.`);
    });
  }
}

export function getAnswerFromId(id: string): string {
  const answer = answers.find((elem) => elem.id === id);
  return answer.name;
}

export function saveAnswersIds(answers: Answer[]) {
  const answersFile = fs.readFileSync(DBFiles.answers_file, "utf-8");
  const answersJson: Answer[] = JSON.parse(answersFile);
  answers.map(({ id, name }) => answersJson.push({ id, name }));
  const writeData = JSON.stringify(answersJson);
  fs.writeFileSync(DBFiles.answers_file, writeData, "utf-8");
}

export function getAnswerer(phone: string): Answerer {
  const answerersFile = fs.readFileSync(DBFiles.result_file, "utf-8");
  const answerersJson: Answerer[] = JSON.parse(answerersFile);
  const returnedData = answerersJson.find((elem) => elem.phone === phone);
  if (!returnedData)
    return { answer: "", phone, is_answer: false, is_polling: false };
  return returnedData;
}

export function saveResult(data: Answerer) {
  const answerersFile = fs.readFileSync(DBFiles.result_file, "utf-8");
  const answerersJson: Answerer[] = JSON.parse(answerersFile);
  const answererIndex = answerersJson.findIndex(
    (elem) => elem.phone === data.phone
  );
  if (answererIndex === -1) {
    answerersJson.push(data);
  } else {
    answerersJson[answererIndex] = data;
  }
  const writeData = JSON.stringify(answerersJson);
  fs.writeFileSync(DBFiles.result_file, writeData, "utf-8");
}
