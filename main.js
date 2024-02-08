const fs = require("fs").promises;
const { resolve, parse } = require("path");

const turndown = require("turndown");

const service = new turndown({
  headingStyle: "atx",
  // codeBlockStyle: 'fenced',
  emDelimiter: "*",
  // preformattedCode: true
});

async function readFile(path) {
  const file = await fs.readFile(path, "utf8");
  return file;
}

async function toFile(title, string) {
  const file = await fs.writeFile(title, string);
}

async function main() {
  if (process.argv[2] == null) {
    console.log(`Error: no filename was specified.`);
    return;
  }
  const parsedFile = parse(resolve(process.argv[2]));
  if (parsedFile.ext !== ".html") {
    console.log(`Error: file must be of type '.html.'`);
    return;
  }

  // console.log(parsedFile.dir);

  const file = await readFile(process.argv[2]);
  const md = service.turndown(file);

  await toFile(`${parsedFile.dir}/${parsedFile.name}.md`, md)
    .then(() => console.log("Success!"))
    .catch((e) => console.log(`Error: ${e.message}`));
}

main().catch((e) => console.log(`Error: ${e.message}`));
