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

app.post('/users', (req, res) => {
  console.log(req.body);
  res.status(201).json({ message: 'User created' });
});

app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: `this server runing ${PORT}`,
  });
});
app.get('/app', (req, res) => {
  res.status(200).json({
    message: `this server runing app ${PORT}`,
  });
});

app.get('/app/:id', (req, res) => {
  const { Id } = req.params;
  res.status(200).json({ id: Id, name: 'Jacob' });
});

app.use((req, res) => {
  console.log(res.status(404).json({ message: 'Route not found' }));
});

app.get('/test-err', (req, res) => {
  throw new Error('EROORORORORRRRR');
});

app.use((err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`All ok ${PORT}`);
});
