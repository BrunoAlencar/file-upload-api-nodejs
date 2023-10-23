// import fs from "fs";
import * as fse from 'fs-extra';
import path from "path";
import { File } from "formidable";
import { NextApiRequest, NextApiResponse } from 'next';
import { parseFormAsync } from '@/app/helpers/formidable';

// Important for NextJS!
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    console.log("Request received");
    // Parse request with formidable
    const { fields, files } = await parseFormAsync(req);

    // Files are always arrays (formidable v3+)
    const myfile = (files["file"] as any as File[])[0];

    // throw new Error('Erro at upload file')
    // Save file in the public folder
    saveFile(myfile, "./public/uploads");

    // Return success
    res.status(200).json("success!");
  } catch (e: any) {
    console.log(e)
    return res.status(500).json({
      message: e.message,
    } as any);
  }
}

function saveFile(file: File, publicFolder: string): void {
  const fileExt = path.extname(file.originalFilename || "");

  fse.moveSync(file.filepath, `${publicFolder}/${file.newFilename}${fileExt}`);
}