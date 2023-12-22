import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
    const apiList = [];
    apiList.push({ url: '/posts', type: 'GET' });
    apiList.push({ url: '/create', type: 'POST' });
    apiList.push({ url: '/update', type: 'POST' });
    apiList.push({ url: '/delete/:id', type: 'DELETE' });
    apiList.push({ url: '/published', type: 'POST' });
    apiList.push({ url: '/filter-post', type: 'GET' });
    res.json(apiList)
})

app.get('/posts', async (req, res) => {
    const posts = await prisma.post.findMany()
    res.json(posts)
})

app.post(`/create`, async (req, res) => {
    const { title } = req.body
    const result = await prisma.post.create({
        data: {
            title,
            authorId: 1,
        },
    })
    res.json(result)
})

app.post(`/update`, async (req, res) => {
    const { id, title, content } = req.body
    const result = await prisma.post.update({
        where: {
            id: Number(id)
        },
        data: {
            title: title,
            content: content
        }
    });
    res.json(result)
})

app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params
    const post = await prisma.post.delete({
        where: { id: Number(id) },
    })
    res.json(post)
})

app.post(`/published`, async (req, res) => {
    const { id, status } = req.body
    const result = await prisma.post.update({
        where: {
            id: id
        },
        data: {
            published: status
        }
    });
    res.json(result)
})

app.get('/filter-post', async (req, res) => {
    const { searchString }: { searchString?: string } = req.query;
    const filteredPosts = await prisma.post.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: searchString,
                    },
                },
            ],
        },
    })
    res.json(filteredPosts)
})

const server = app.listen(4000, () =>
    console.log(
        '🚀 Server ready at: http://localhost:4000',
    ),
)