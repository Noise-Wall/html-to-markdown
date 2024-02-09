#!/usr/bin/env node
const { program } = require("commander");
const fs = require("fs").promises;
const { resolve, parse, basename } = require("path");

const turndown = require("turndown");
// const program = new commander.Command();

program
  .name("html2md")
  .description("Parses HTML to Markdown. For use in Obsidian vaults.")
  .version("0.0.1")
  .argument("<file>")
program.option("-u, --underscore", "Replace underscores with whitespaces");
program.option("-d, --dash", "Replace underscores with whitespaces");

program.parse();

const service = new turndown({
  headingStyle: "atx",
  // codeBlockStyle: 'fenced',
  emDelimiter: "*",
  // preformattedCode: true
});

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function readFile(path: string) {
  const file = await fs.readFile(path, "utf8");
  return file;
}

async function toFile(title: string, string: string) {
  await fs.writeFile(title, string);
}

async function renameFile(oldPath: string, newPath: string) {
  await fs.rename(oldPath, newPath);
}

async function main() {

  const parsedFile = parse(resolve(program.args[0]));

  if (parsedFile.ext !== ".html" && parsedFile.ext !== ".md") {
    console.log(`error: file must be of type '.html' or '.md'.`);
    return 2;
  }

  if (Boolean(program.opts().underscore))
    parsedFile.name = parsedFile.name.replaceAll("_", " ");

  if (Boolean(program.opts().dash))
    parsedFile.name = parsedFile.name.replaceAll("-", " ");

  const file = await readFile(program.args[0]);
  let newFileName: string =
    parsedFile.name === "index"
      ? `${capitalize(basename(parsedFile.dir))}`
      : capitalize(parsedFile.name);

  if (parsedFile.ext == ".html") {
    const md = service.turndown(file);

    await toFile(`${parsedFile.dir}/${newFileName}.md`, md)
      .then(() => console.log("HTML converted successfully!"))
      .catch((e) => console.log(`Error: ${e.message}`));
  } else if (parsedFile.ext == ".md") {
    await renameFile(program.args[0], `${parsedFile.dir}/${newFileName}.md`)
      .then(() => console.log("Markdown renamed successfully!"))
      .catch((e) => console.log(`Error: ${e.message}`));
  }
}

main().catch((e) => console.log(`Error: ${e.message}`));
