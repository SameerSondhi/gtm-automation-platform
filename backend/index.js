// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import enrichLeadRoute from './routes/enrichLead.js';
import generateOutreach from './routes/generateOutreach.js';
import leadsRouter from './routes/leads.js';
import organizationsRouter from './routes/organizations.js';
import outreachRoutes from './routes/generateOutreach.js';
import dashboardRoutes from './routes/dashboardLeads.js';
import userRoutes from './routes/user.js';
import integrations from './routes/integrations.js';
import preferenceRoutes from './routes/preferences.js';
import tagRoutes from './routes/tags.js';
import messageRouter from './routes/messages.js';
import summaryRoutes from './routes/summary.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', enrichLeadRoute);
app.use('/api', generateOutreach);
app.use('/api', leadsRouter);
app.use('/api', organizationsRouter);
app.use('/api', outreachRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', userRoutes);
app.use('/api', integrations);
app.use('/api', preferenceRoutes);
app.use('/api', tagRoutes);
app.use('/api/messages', messageRouter);
app.use('/api/summary', summaryRoutes);


app.listen(4000, () => console.log('Proxy listening on port 4000'));