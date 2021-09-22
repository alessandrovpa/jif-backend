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

    const pdfDoc = pdf.createPdfKitDocument({
      content: [
        {
          text: [
            {
              text: `${athlete.name}`,
              bold: true,
            },
            ' portador do RG ',
            {
              text: `${athlete.identity}`,
              bold: true,
            },
          ],
          fontSize: 17,
          alignment: 'center',
          margin: [0, 290, 0, 0],
        },
      ],
      defaultStyle: {
        font: 'Helvetica',
        color: '#1C1C1C',
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
    });
    const file = `${uploadConfig.certifiedFolder}/EJIF GAMES CERTIFICADO.pdf`;
    pdfDoc.pipe(fs.createWriteStream(file));
    pdfDoc.end();
    const url = `${process.env.API_URL}/certified/EJIF GAMES CERTIFICADO.pdf`;
    return url;
  }
}

export default GetAthelteCertifiedService;
