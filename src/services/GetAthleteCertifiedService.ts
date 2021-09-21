import Athlete from '../models/Athlete';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import pdfMake from 'pdfmake';
import fs from 'fs';
import path from 'path';
import uploadConfig from '../config/upload';

class GetAthelteCertifiedService {
  public async execute(email: string): Promise<string> {
    const athleteRepository = getRepository(Athlete);
    const athlete = await athleteRepository.findOne({
      where: {
        email,
      },
      select: ['id', 'name', 'identity'],
    });
    if (!athlete) {
      throw new AppError('Atleta não encontrato');
    }

    const fonts = {
      Courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique',
      },
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
      Times: {
        normal: 'Times-Roman',
        bold: 'Times-Bold',
        italics: 'Times-Italic',
        bolditalics: 'Times-BoldItalic',
      },
      Symbol: {
        normal: 'Symbol',
      },
      ZapfDingbats: {
        normal: 'ZapfDingbats',
      },
    };

    const pdf = new pdfMake(fonts);

    const background = path.resolve(
      __dirname,
      '..',
      'assets',
      'certificado.jpg',
    );

    const docDefiniton = {
      content: [
        {
          text: `${athlete.name} portador do RG ${athlete.identity}`,
          fontSize: 20,
          alignment: 'center',
          margin: [0, 290, 0, 0],
        },
      ],
      defaultStyle: {
        font: 'Helvetica',
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [0, 0, 0, 0],
      background: [
        {
          image: background,
          width: 840,
        },
      ],
    };

    const pdfDoc = pdf.createPdfKitDocument(docDefiniton);
    const file = `${uploadConfig.certifiedFolder}/EJIF GAMES ${athlete.name}.pdf`;
    pdfDoc.pipe(fs.createWriteStream(file));
    pdfDoc.end();
    const url = `${process.env.API_URL}/certified/EJIF GAMES ${athlete.name}.pdf`;
    return url;
  }
}

export default GetAthelteCertifiedService;
