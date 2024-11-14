const userRouter = require('express').Router();
const usertModel = require('../models/user.js');
const requestModel = require('../models/requests.js');
const connectDB = require('../config/mongodb.js');

userRouter.get('/requests', async (_, res) => {
    try {
        let requests = await requestModel.find({});
        return res.status(200).send(requests);
    } catch (error) {
        console.log(`error while fetching the user request\n${error}`);
        return res.status(500).send({ message: error?.message || error });
    }
})

userRouter.get('/approveRequest/:id', async (req, res) => {
    try {
        let requestId = req?.params?.id;
        await connectDB();
        let request = await requestModel.findByIdAndUpdate(requestId, {
            $set: {
                status: 'approved',
            }
        }, { new: true });
        let records = await usertModel.findOne({
            email: request?.email,
        })
        if (records) {
            return res.status(200).send({ message: 'User Already Exists' });
        }
        await usertModel.create({
            email: request?.email,
        });

        return res.status(200).send('Approved');

    } catch (error) {
        console.log(`error while approving the user request\n${error}`);
        return res.status(500).send({ message: error?.message || error });
    }
})


userRouter.get('/rejectRequest/:id', async (req, res) => {
    try {
        let requestId = req?.params?.id;
        await connectDB();
        await requestModel.findByIdAndUpdate(requestId, {
            $set: {
                status: 'rejected',
            }
        });

        return res.status(200).send('Rejected');

    } catch (error) {
        console.log(`error while rejecting the user request\n${error}`);
        return res.status(500).send({ message: error?.message || error });
    }
})


userRouter.post('/', async (req, res) => {
    try {
        await connectDB();
        const user = new usertModel(req?.body);
        await user.save();
        return res.status(201).send(user);
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(409).send({ message: 'Email Already Exists' })
        }
        console.log(`error while creating new user\n${err}`);
        return res.status(500).send({ message: err?.message || err });
    }
})

userRouter.delete('/:id', async (req, res) => {
    try {
        await connectDB();
        let userId = req?.params?.id;
        await usertModel.findByIdAndDelete(userId);
        return res.status(200).send('User deleted successfully');
    } catch (err) {
        console.log(`error while deleting the user,\n${err.message}`);
        return res.status(500).send({ message: err?.message || err });
    }
})

userRouter.get('/', async (req, res) => {
    try {
        await connectDB();
        const users = await usertModel.find();
        return res.status(200).send(users);
    } catch (err) {
        console.log(`error while retrieving users \n${err}`);
        return res.status(500).send({ message: err?.message || err });
    }
})


userRouter.put('/:id', async (req, res) => {
    try {
        await connectDB();
        let userId = req.params.id;
        let updatedData = req.body;
        const updatedUserInfo = await usertModel.findByIdAndUpdate(
            userId,
            {
                $set: updatedData
            },
            { new: true }
        );
        return res.status(200).send(updatedUserInfo);
    } catch (err) {
        console.log(`error while editing user\n${err}`);
        res.status(500).send({ message: err?.message || err });
    }
})

module.exports = userRouter;