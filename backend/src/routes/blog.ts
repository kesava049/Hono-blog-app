import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { createBlogInput, updateBlogInput } from "@100xk/medium-common";


export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
      };
      Variables: {
        userId: string;
      };
}>();

//Middleware
blogRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    try {
      const user = await verify(authHeader, c.env.JWT_SECRET);
      c.set("userId", user.id as string);
      await next();
    } catch (err) {
      c.status(403);
      return c.json({
        msg: "You're not logged in!"
      });
    }
});

blogRouter.post('/', async(c, next) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            msg: "Invalid Blog Inputs!"
        })
    }
    const userId = c.get("userId");
	const prisma = new PrismaClient().$extends(withAccelerate())
    try {
        const blog = await prisma.blog.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId // this is main-thing
            }  
        })
        return c.json({
            id: blog.id,
        })
    } catch(e){
        c.status(411)
        return c.json({
            error: "failed during putting blog"
        })
    }
    
})

blogRouter.put('/', async (c) => {
	
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            msg: "Invalid Blog Inputs!"
        })
    }
    const prisma = new PrismaClient().$extends(withAccelerate())
    try{
        const blog = await prisma.blog.update({
            where: {
                id: body.id
            },
            data: {
                title: body.title,
                content: body.content,
            }  
        })
    
        return c.json({
            id: blog.id,
            message: 'update blog successfully'
        })
    } catch(e){
        c.status(411);
        return c.json({
            error: "failed during updating the blog.."
        })
    }
    
})

blogRouter.get('/bulk', async(c) => {
	const prisma = new PrismaClient().$extends(withAccelerate())

    try{
        const blogs = await prisma.blog.findMany();
        c.status(200);
        return c.json({
            blogs
        })
    }catch(e){
        c.status(411);
        return c.json({
            error: "error while fetching all the bolgs"
        })
    }
})

blogRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    const prisma = new PrismaClient().$extends(withAccelerate());
  
    try {
      const blog = await prisma.blog.findFirst({
        where: {
          id
        }
      });
  
      return c.json({ blog });
    } catch (e) {
      c.status(411);
      return c.json({
        error: "failed during getting the blog details"
      });
    }
});

