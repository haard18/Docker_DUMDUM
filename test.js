const Irys = require('@irys/sdk');

// const DEPLOY_FOLDER = './dist';

// (async () => {
//     if (!process.env.DEPLOY_KEY) {
//         console.error('DEPLOY_KEY not configured');
//         return;
//     }

//     let jwk = JSON.parse(Buffer.from(process.env.DEPLOY_KEY, 'base64').toString('utf-8'));

//     const irys = new Irys({ url: 'https://turbo.ardrive.io', token: 'arweave', key: jwk });
//     irys.uploader.useChunking = false;

//     try {
//         console.log(`Deploying ${DEPLOY_FOLDER} folder`);

//         const txResult = await irys.uploadFolder(DEPLOY_FOLDER, {
//             indexFile: 'index.html',
//             interactivePreflight: false,
//         });

//         console.log(`Bundle TxId [${txResult.id}]`);

//         return txResult.id;
//     } catch (e) {
//         console.error(e);
//     }
// })();
const deploy = async () => {
    const DEPLOY_KEY = process.argv[2];
    const DEPLOY_FOLDER = process.argv[3];
    console.log(DEPLOY_KEY);
    if (!DEPLOY_KEY) {
        console.error('DEPLOY_KEY not provided');
        return;
    }

    let jwk = JSON.parse(Buffer.from(DEPLOY_KEY, 'base64').toString('utf-8'));

    const irys = new Irys({ url: 'https://turbo.ardrive.io', token: 'arweave', key: jwk });
    irys.uploader.useChunking = false;

    try {
        console.log(`Deploying ${DEPLOY_FOLDER} folder`);

        const txResult = await irys.uploadFolder(DEPLOY_FOLDER, {
            indexFile: 'index.html',
            interactivePreflight: false,
        });

        console.log(`Bundle TxId [${txResult.id}]`);

        return txResult.id;
    } catch (e) {
        console.error(e);
    }
}
deploy();