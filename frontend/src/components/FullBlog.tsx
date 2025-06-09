import type { Blog } from "../hooks"
import { Appbar } from "./Appbar"
import { Avatar } from "./BlogCard"
export const FullBlog = ({ blog }: { blog: Blog }) => {
    const postDate = blog.publishedAt
        ? new Date(blog.publishedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Unknown date"

    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-12 px-4 md:px-10 w-full pt-12 max-w-screen-xl">
                    <div className="md:col-span-8">
                        <div className="text-5xl font-extrabold">
                            {blog.title}
                        </div>
                        <div className="text-slate-500 pt-2">
                            Posted on {postDate}
                        </div>
                        <div className="pt-4 text-lg leading-relaxed">
                            {/* If using raw HTML content from a CMS, use the below line:
                            <div
                                className="prose"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            /> 
                            */}
                            {blog.content}
                        </div>
                    </div>

                    <div className="md:col-span-4 mt-8 md:mt-0">
                        <div className="text-slate-600 text-lg mb-2">
                            Author
                        </div>
                        <div className="flex w-full">
                            <div className="pr-4 flex flex-col justify-center">
                                <Avatar
                                    size="big"
                                    name={blog.author?.name || "Anonymous"}
                                />
                            </div>
                            <div>
                                <div className="text-xl font-bold">
                                    {blog.author?.name || "Anonymous"}
                                </div>
                                <div className="pt-2 text-slate-500">
                                    Random catch phrase about the author's ability
                                    to grab the user's attention
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}