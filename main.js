const fs = require("fs").promises;
const { resolve, parse, basename } = require("path");

const turndown = require("turndown");

const service = new turndown({
  headingStyle: "atx",
  // codeBlockStyle: 'fenced',
  emDelimiter: "*",
  // preformattedCode: true
});

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function readFile(path) {
  const file = await fs.readFile(path, "utf8");
  return file;
}

async function toFile(title, string) {
  await fs.writeFile(title, string);
}

async function renameFile(oldPath, newPath) {
  await fs.rename(oldPath, newPath);
}

async function main() {
  if (process.argv[2] == null) {
    console.log(`Error: no filename was specified.`);
    return;
  }
  const parsedFile = parse(resolve(process.argv[2]));
  if (parsedFile.ext !== ".html" && parsedFile.ext !== ".md") {
    console.log(`Error: file must be of type '.html' or '.md'.`);
    return;
  }

  const file = await readFile(process.argv[2]);
  const newFileName =
    parsedFile.name === "index"
      ? `${capitalize(basename(parsedFile.dir))}`
      : capitalize(parsedFile.name);

  if (parsedFile.ext == ".html") {
    const md = service.turndown(file);

    await toFile(`${parsedFile.dir}/${newFileName}.md`, md)
      .then(() => console.log("HTML converted successfully!"))
      .catch((e) => console.log(`Error: ${e.message}`));
  } else if (parsedFile.ext == ".md") {
    await renameFile(process.argv[2], `${parsedFile.dir}/${newFileName}.md`)
      .then(() => console.log("Markdown renamed successfully!"))
      .catch((e) => console.log(`Error: ${e.message}`));
  }
}

main().catch((e) => console.log(`Error: ${e.message}`));
