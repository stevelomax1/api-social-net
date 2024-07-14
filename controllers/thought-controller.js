const {Thought, User} = require('../models');
const {Types} = require('mongoose');

const thoughtController = {
    async getThoughts(req, res){
        try{
            const dbThoughts = await Thought.find()
            .sort({createdAt: -1});

            res.json(dbThoughts);
        } catch{
            console.log(error);
            res.status(500).json(error);
        }
    },

    async getSingleThought(req,res){
        try{
            const dbThoughts = await Thought.findOne({_id: req.params.thoughtId});

            if(!dbThoughts){
                return res.status(404).json({message: 'Thought not found'});
            }

            res.json(dbThoughts);
        } catch(error){
            console.log(error);
            res.status(500).json(error);
        }
    },

    async createThought(req,res){
        try{
            console.log('Request Body:', req.body);

            const userId = req.body.userId;
            if (!userId || !Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'Invalid or missing user ID.' });
            };

            const userObjectId = new Types.ObjectId(userId);
            const dbThoughts = await Thought.create(req.body);

            const dbUserData = await User.findOneAndUpdate(
                {_id: userObjectId},
                {$push: {thoughts: dbThoughts._id}},
                {new: true}
            );

            if(!dbUserData){
                await Thought.findByIdAndDelete(dbThought._id);
                return res.status(404).json({message: 'This thought doesnt have a user.'});
            }
            res.json({message: 'Thought was created!!'});
        }catch(error){
            console.log('Error creating thought:',error);
            res.status(500).json(error);
        }
    },

    async updateThought(req,res){
        try{
        const dbThoughts = await Thought.findOneAndUpdate({_id: req.params.thoughtId},{$set: req.body},{runValidators: true, new: true});
    

        if(!dbThoughts){
            return res.status(404).json({ message: 'No thought matches this id.'});
        }

        res.json(dbThoughts);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
    },

    async deleteThought(req,res){
        try{
            const dbThoughts = await Thought.findOneAndRemove({_id: req.params.thoughtId})
            if(!dbThoughts){
                return res.status(404).json({message: 'No thought matches this id.'});
            }

            const dbUserData = User.findOneAndUpdate(
                {thoughts: req.params.thoughtId},
                {$pull: {thoughts: req.params.thoughtId}},
                {new: true}
            );

            if(!dbUserData){
                return res.status(404).json({message: 'Thought was created but there is no user with this id.'});
            }

            res.json({message: 'Thought Was deleted!'});
        }catch(error){
            console.log(error);
            res.status(500).json(error);
        }
    },

    async addReaction(req,res){
        try{
            const dbThoughts = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$addToSet: { reactions: req.body}},
                {runValidators: true, new: true}
            );

            if(!dbThoughts){
                return res.status(404).json({message: 'No thought matches this id.'});
            }
            res.json(dbThoughts);
        }catch(error){
            console.log(error);
            res.status(500).json(error);
        }
    },

    async removeReaction(req, res){
        try{
            const dbThoughts = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$pull: {reactions: {reactionId: req.params.reactionId}}},
                {runValidators: true, new: true}
            );

            if(!dbThoughts){
                return res.status(404).json({message: 'No thought matches this id.'});
            }

            res.json(dbThoughts);
        } catch(error){
            console.log(error);
            res.status(500).json(error);
        }
    },
};

module.exports= thoughtController;