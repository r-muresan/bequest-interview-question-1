import { app } from './app';
import blockchainRoutes from './modules/blockchain/routes/blockchain.routes';
// MIDLEWARES
import { errorMiddleware } from "./middlewares/error.middleware";
app.use('/blockchain', blockchainRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use(errorMiddleware);

export default app;