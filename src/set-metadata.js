import fs from "node:fs/promises";
import { PDFDocument } from "pdf-lib";

async function main() {
  try {
    const { argv } = process;
    if (argv.length === 2) {
      throw new Error("Expected at least one argument!");
    }

    const bytes = await fs.readFile(argv[2]);
    const pdfDoc = await PDFDocument.load(bytes);
    const metadata = JSON.parse(argv[4]);

    console.log("metadata:", metadata);
    console.log("Writing metadata...");

    if (metadata.title) pdfDoc.setTitle(metadata.title);
    if (metadata.author) pdfDoc.setAuthor(metadata.author);
    if (metadata.subject) pdfDoc.setSubject(metadata.subject);
    if (metadata.keywords) pdfDoc.setKeywords(metadata.keywords);
    if (metadata.producer) pdfDoc.setProducer(metadata.producer);
    if (metadata.creator) pdfDoc.setCreator(metadata.creator);
    if (metadata.creationDate) pdfDoc.setCreationDate(metadata.creationDate);
    if (metadata.ModificationDate)
      pdfDoc.setModificationDate(metadata.ModificationDate);

    const pdfBytes = await pdfDoc.save();

    await fs.writeFile(argv[3], pdfBytes);
    console.log("File written successfully");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
