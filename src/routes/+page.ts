import { getFilteredPosts } from '../utils';
import type { PostItem } from '../types/global';

/** @type {import('./$types').PageLoad} */
export async function load(params) {
	const posts: Array<PostItem> = await getFilteredPosts({ params });
    posts.sort((p1, p2) => (p1.date > p2.date) ? -1 : 1);

	return {
		status: 200,
		headers: {},
		recentPosts: posts.slice(0, 3)
	};
}
