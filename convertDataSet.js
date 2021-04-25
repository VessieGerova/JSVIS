const FS = require("fs");

const dataSetContent = FS.readFileSync("./enron-v1.csv", "utf8");
console.log("Data set loaded");

const lines = dataSetContent.split(/\r?\n/);
const dataLines = lines.slice(1).filter(line=>line.includes(","));
const dataElements = dataLines.map(line=>line.split(","));

const people = [];
const emails = [];
const jobs = [];

dataElements.forEach(element=>{
    const [
        date,
        sourceIDString,
        sourceMailAddress,
        sourceJobTitle,
        targetIDString,
        targetMailAddress,
        targetJobTitle,
        messageType,
        sentimentString
    ] = element;
    const sourceID = Number(sourceIDString);
    const targetID = Number(targetIDString);
    const sentiment = Number(sentimentString);

    if(!people.some(person=>person.id == sourceID))
        people.push({mail: sourceMailAddress, group:sourceJobTitle, id: sourceID});
    if(!jobs.includes(sourceJobTitle))
        jobs.push(sourceJobTitle);

    if(!people.some(person=>person.id == targetID))
        people.push({mail: targetMailAddress, group:targetJobTitle, id: targetID});
    if(!jobs.includes(targetJobTitle))
        jobs.push(targetJobTitle);

    emails.push({source: sourceID, target: targetID, timestamp: date, sentiment, type: messageType});
});
console.log("Data converted");

const output = {
    people,
    emails,
    jobs,
};
const outputString = JSON.stringify(output, null, 4);
FS.writeFileSync("./enron-v1.json", outputString, "utf8");
console.log("Data stored as json");

const outputStringJs = "const dataSet = "+JSON.stringify(output, null, 4);
FS.writeFileSync("./enron-v1.js", outputStringJs, "utf8");
console.log("Data stored as js");
