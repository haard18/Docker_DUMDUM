const express = require('express');
const bodyParser = require('body-parser');
const Docker = require('dockerode');
const docker = new Docker();
const mongoose=require('mongoose');
const Deployement = require('./deploy');
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.post('/storeDeployement',async(req,res)=>{
    const databaseUrl=process.env.DATABASE_URL;
    const {projectName,githubUrl,installCommand,buildCommand,outputFolder,wallet,antProcessId}=req.body;
    try {
        await mongoose.connect(databaseUrl);
        const existingDeployement=await Deployement.findOne({
            projectName
        });
        if(existingDeployement){
            return res.status(400).send('Project already exists');
        }
        const deployement=await Deployement.create({
            projectName,
            githubUrl,
            installCommand,
            buildCommand,
            outputFolder,
            wallet,
            antProcessId

        });
        res.send(deployement);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error storing deployment');
    }

})
app.get('/getDeployement',async(req,res)=>{
    const databaseUrl=process.env.DATABASE_URL;
    try {
        await mongoose.connect(databaseUrl);
        const deployements=await Deployement.find();
        res.send(deployements);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error getting deployements');
    }
})
app.post('/build', async (req, res) => {
    const { githubUrl, installCommand, buildCommand, outputFolder, wallet, antProcessId } = req.body;

    if (!githubUrl || !installCommand || !buildCommand || !outputFolder || !wallet || !antProcessId) {
        return res.status(400).send('GITHUB_URL, INSTALL_COMMAND, BUILD_COMMAND, OUTPUT_FOLDER, WALLET, and ANT_PROCESS_ID are required');
    }

    try {
        const container = await docker.createContainer({
            Image: 'hardy18/gitbuild:latest',
            Env: [
                `GITHUB_URL=${githubUrl}`,
                `INSTALL_COMMAND=${installCommand}`,
                `BUILD_COMMAND=${buildCommand}`,
                `OUTPUT_FOLDER=${outputFolder}`,
                `DEPLOY_KEY=${wallet}`,
                `ANT_PROCESS_ID=${antProcessId}`
            ],
            AttachStdout: true,
            AttachStderr: true
        });

        await container.start();

        const stream = await container.logs({
            follow: true,
            stdout: true,
            stderr: true
        });

        stream.on('data', (chunk) => {
            console.log(chunk.toString('utf8'));
        });

        await container.wait();

        await container.remove();

        res.send('Build successful');
    } catch (err) {
        console.error(err);
        res.status(500).send('Build failed');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
