import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";
import { PostContent } from "@types";

const postsDirectory = path.join(process.cwd(), "content/posts");

let postCache: PostContent[];
let tagCache: string[];

export function getAllPosts(): PostContent[] {
  if (postCache) {
    return postCache;
  }
  
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
        },
      });
      const matterData = matterResult.data as {
        date: string;
        title: string;
        tags: string[];
        slug: string;
        fullPath: string,
        hidden: boolean
      };
      matterData.fullPath = fullPath;

      const slug = fileName.replace(/\.mdx$/, "");

      // Validate slug string
      if (matterData.slug !== slug) {
        throw new Error(
          "slug field not match with the path of its content source"
        );
      }

      return matterData;
    });

  // Sort posts by date
  postCache = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
  return postCache;
}

export function getPostCount(tag?: string): number {
  return getAllPosts().filter(
    (it) => !tag || (it.tags && it.tags.includes(tag))
  ).length;
}

export function getPosts(
  page: number,
  limit: number,
  tag?: string
): PostContent[] {
  return getAllPosts()
    .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
    .filter((it) => it?.hidden != true)
    .slice((page - 1) * limit, page * limit);
}

export function getAllTags(): string[] {
  if (tagCache)
    return tagCache;
  
  tagCache = getAllPosts()
    .map(post => post.tags || [])
    .reduceRight((t1, t2) => [...t1, ...t2], []);
  
    return tagCache;
}