import experss from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

const app = experss();
const PORT = process.env.PORT ?? 4787;

app.use(experss.json());
app.use(cors());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.listen(PORT, () => {
  console.log(`Еhe server is running ${PORT}`);
});
