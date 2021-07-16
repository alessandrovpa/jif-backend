import clearString from './clearString';

export default function formatContact(number: string): string {
  let formattedNumber = '';
  const clearedNumer = clearString(number);
  if (clearedNumer.length === 10) {
    formattedNumber = clearedNumer.replace(
      /(\d{2})(\d{4})(\d{4})/g,
      '($1) $2-$3',
    );
  } else if (clearedNumer.length === 11) {
    formattedNumber = clearedNumer.replace(
      /(\d{2})(\d{5})(\d{4})/g,
      '($1) $2-$3',
    );
  }
  return formattedNumber;
}
