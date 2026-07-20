import { decodeHtmlEntities } from './decodeEntities';

export function generateExcerpt(content: string, type: 'md' | 'html', maxLength = 200): string {
  let text = content;

  if (type === 'html') {
    text = decodeHtmlEntities(text.replace(/<[^>]+>/g, ' '));
  } else {
    text = text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`[^`]+`/g, '')
      .replace(/^[>*+-]\s+/gm, '');
  }

  text = text.replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  const cut = text.lastIndexOf(' ', maxLength);
  return text.slice(0, cut > 0 ? cut : maxLength) + '…';
}
