import express from 'express';

import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

app.use(express.json());

// API routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1', userRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});