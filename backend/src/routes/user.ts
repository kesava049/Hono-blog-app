import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signinInput, signupInput } from '@100xk/medium-common'


export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string;
        JWT_SECRET: string;
	}
}>();

userRouter.post('/signup', async (c) => {
	
	const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({ msg: "Invalid Inputs"})
    }
    const prisma = new PrismaClient().$extends(withAccelerate())
	try {
		const user = await prisma.user.create({
			data: {
				email: body.email,
				password: body.password
			}
		});
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch(e) {
		c.status(403);
		return c.json({ error: "error while signing up" });
	}
})

userRouter.post('/signin', async(c) => {
    const body = await c.req.json()
    const { success } = signinInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            msg: "Invalid Credentials!"
        })
    }
    const prisma = new PrismaClient().$extends(withAccelerate())

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
                password: body.password
            }
        })

        if (!user) {
            return c.json({
                message: 'Invalid credentials',
            }, 403)
        }

        const token = await sign({id: user.id}, c.env.JWT_SECRET)

        return c.json({
            message: 'User signed in successfully',
            token: token,
        })
    }
    catch (error) {
        return c.json({
            message: 'User signed in failed',
            error: error,
        }, 500)
    }
})