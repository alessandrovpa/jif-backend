export default function clearString(string: string): String {
  let clearedString = string.trim();
  clearedString = string
    .split('-')
    .join('')
    .split('(')
    .join('')
    .split(')')
    .join('')
    .split(' ')
    .join('')
    .split('.')
    .join('');
  clearedString = clearedString.replace(/(\r\n|\n|\r)/gm, '');
  clearedString = clearedString.replace(/\s+/g, '');

  return clearedString;
}
