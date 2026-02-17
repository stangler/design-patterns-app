import { codeToHtml } from 'shiki';

export async function highlightCode(code: string) {
  return await codeToHtml(code, {
    lang: 'ts',
    theme: 'github-dark',
  });
}
