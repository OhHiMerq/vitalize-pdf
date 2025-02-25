import fs from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import { z } from "zod";

async function main() {
  try {
    const { argv } = process;
    if (argv.length === 2) {
      throw new Error("Expected at least one argument!");
    }

    const bytes = await fs.readFile(argv[2]);
    const pdfDoc = await PDFDocument.load(bytes);
    const metadata = JSON.parse(argv[4]);

    const metadataSchema = z.object({
      title: z.string().optional(),
      author: z.number().optional(),
      subject: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      producer: z.string().optional(),
      creator: z.string().optional(),
      creationDate: z.coerce.date().optional(),
      modificationDate: z.coerce.date().optional(),
    });

    const data = metadataSchema.parse(metadata);
    const {
      title,
      author,
      subject,
      keywords,
      producer,
      creator,
      creationDate,
      modificationDate,
    } = data;

    console.log("metadata:", data);
    console.log("Writing metadata...");

    if (title) pdfDoc.setTitle(title);
    if (author) pdfDoc.setAuthor(author);
    if (subject) pdfDoc.setSubject(subject);
    if (keywords) pdfDoc.setKeywords(keywords);
    if (producer) pdfDoc.setProducer(producer);
    if (creator) pdfDoc.setCreator(creator);
    if (creationDate) pdfDoc.setCreationDate(creationDate);
    if (modificationDate) pdfDoc.setModificationDate(modificationDate);

    const pdfBytes = await pdfDoc.save();

    await fs.writeFile(argv[3], pdfBytes);
    console.log("File written successfully");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
