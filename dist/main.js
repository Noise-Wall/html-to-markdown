#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { program } = require("commander");
const fs = require("fs").promises;
const { resolve, parse, basename } = require("path");
const turndown = require("turndown");
// const program = new commander.Command();
program
    .name("html2md")
    .description("Parses HTML to Markdown. For use in Obsidian vaults.")
    .version("0.0.1")
    .argument("<file>");
program.option("-u, --underscore", "Replace underscores with whitespaces");
program.option("-d, --dash", "Replace underscores with whitespaces");
program.parse();
const service = new turndown({
    headingStyle: "atx",
    // codeBlockStyle: 'fenced',
    emDelimiter: "*",
    // preformattedCode: true
});
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function readFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = yield fs.readFile(path, "utf8");
        return file;
    });
}
function toFile(title, string) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.writeFile(title, string);
    });
}
function renameFile(oldPath, newPath) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.rename(oldPath, newPath);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const parsedFile = parse(resolve(program.args[0]));
        if (parsedFile.ext !== ".html" && parsedFile.ext !== ".md") {
            console.log(`error: file must be of type '.html' or '.md'.`);
            return 2;
        }
        if (Boolean(program.opts().underscore))
            parsedFile.name = parsedFile.name.replaceAll("_", " ");
        if (Boolean(program.opts().dash))
            parsedFile.name = parsedFile.name.replaceAll("-", " ");
        const file = yield readFile(program.args[0]);
        let newFileName = parsedFile.name === "index"
            ? `${capitalize(basename(parsedFile.dir))}`
            : capitalize(parsedFile.name);
        if (parsedFile.ext == ".html") {
            const md = service.turndown(file);
            yield toFile(`${parsedFile.dir}/${newFileName}.md`, md)
                .then(() => console.log("HTML converted successfully!"))
                .catch((e) => console.log(`Error: ${e.message}`));
        }
        else if (parsedFile.ext == ".md") {
            yield renameFile(program.args[0], `${parsedFile.dir}/${newFileName}.md`)
                .then(() => console.log("Markdown renamed successfully!"))
                .catch((e) => console.log(`Error: ${e.message}`));
        }
    });
}
main().catch((e) => console.log(`Error: ${e.message}`));
