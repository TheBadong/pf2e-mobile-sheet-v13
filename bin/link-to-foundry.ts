import fs from "fs";
import "dotenv/config";

const currentPath = import.meta.dirname;

const foundryDataPath = process.env.DATA_PATH;

if (!foundryDataPath) {
	console.error("No FroundryVTT Data path found! Make sure path is set in .env");
	process.exit();
}

// console.log(fs.existsSync(`${foundryDataPath}/modules/mobile-sheet/`));
if (!fs.existsSync(`${foundryDataPath}/modules/`)) {
	fs.mkdirSync(`${foundryDataPath}/modules/`);
}

if (!fs.existsSync(`${foundryDataPath}/modules/mobile-sheet`)) {
	fs.symlinkSync(`${currentPath}/../dist`, `${foundryDataPath}/modules/mobile-sheet`);
}

console.log(`Linked ${currentPath}/../dist to ${foundryDataPath}/modules/mobile-sheet`);
