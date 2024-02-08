# HTML to Markdown

A simple, personal program to parse HTML files to Markdown. For my Obsidian vaults.

If the filename is an index page, the program renames the file to that of its directory. If the file is of type `.md`, it skips the conversion part and renames if needed.

Utilizes ![turndown](https://github.com/mixmark-io/turndown). Not much else.

### Usage

Requires *Node.js* (tested with version 21.6.1)

```bash
$ /path/to/project/run.sh $(file)
```

Paired with bash command `find`:

```bash
$ find ./ -type f -name $(file) -exec sh -c /path/to/project/run.sh '{}' \; 
```