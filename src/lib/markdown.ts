import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

function getBasePath(category: string, id: string) {
  return path.join(
    process.cwd(),
    'src',
    'domain',
    'patterns',
    category,
    id
  );
}

export async function getMarkdownFile(
  category: string,
  id: string,
  fileName: string
) {
  const filePath = path.join(
    getBasePath(category, id),
    fileName
  );

  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');

  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(content);

  return {
    meta: data,
    contentHtml: processedContent.toString(),
  };
}

export function getSolutionCode(
  category: string,
  id: string
) {
  const filePath = path.join(
    getBasePath(category, id),
    'solution.ts'
  );

  if (!fs.existsSync(filePath)) {
    console.log('Solution not found:', filePath);
    return null;
  }

  return fs.readFileSync(filePath, 'utf8');
}
