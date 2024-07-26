const express = require('express');
const bodyParser = require('body-parser');
const Docker = require('dockerode');
const docker = new Docker();

const app = express();
app.use(bodyParser.json());

app.post('/build', async (req, res) => {
    const { githubUrl, installCommand, buildCommand, outputFolder } = req.body;

    if (!githubUrl || !installCommand || !buildCommand || !outputFolder) {
        return res.status(400).send('GITHUB_URL, INSTALL_COMMAND, BUILD_COMMAND, and OUTPUT_FOLDER are required');
    }

    try {
        const container = await docker.createContainer({
            Image: 'hardy18/gitbuild:latest',
            Env: [
                `GITHUB_URL=${githubUrl}`,
                `INSTALL_COMMAND=${installCommand}`,
                `BUILD_COMMAND=${buildCommand}`,
                `OUTPUT_FOLDER=${outputFolder}`
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
