const fs = require("fs");
const path = require("path");

const repo_directory = path.join(__dirname, "..", "..");
const excluded_folders = ["node_modules", "out", "include", "archive", ".github", ".vscode", "scripts"];
const target_exts = [".tsx", ".ts", ".lua"];

let lines_of_code = 0;

function visitDirectory(directory, excludeEmptyLines) {
	for (const child of fs.readdirSync(directory)) {
		if (excluded_folders.includes(child)) {
			continue;
		}

		const realPath = path.join(directory, child);
		const stat = fs.statSync(realPath);

		if (stat.isDirectory()) {
			visitDirectory(realPath, excludeEmptyLines);
		} else if (stat.isFile()) {
			const ext = path.extname(realPath);
			if (target_exts.some(v => v === ext)) {
				console.log(`Counting ${realPath}`);

				const lines = fs
					.readFileSync(realPath)
					.toString()
					.split("\n")
					.filter(line => {
						if (excludeEmptyLines) {
							return line !== "";
						}
						return true;
					}).length;

				lines_of_code += lines;
			}
		}
	}
}

// parse parameters
const parameters = process.argv.slice(2);
const exclude_empty_lines = parameters.includes("--exclude-empty-lines");

visitDirectory(repo_directory, exclude_empty_lines);
console.log(`You've written ${lines_of_code} lines of code${exclude_empty_lines ? " without empty lines." : "."}`);
