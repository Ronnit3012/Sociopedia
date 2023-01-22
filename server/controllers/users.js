import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        return res.status(200).json(user);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        // Get User's Friend Details
        const friends = await Promise.all(
            user.friends.map(async (id) => await User.findById(id))
        );

        // Format Friends
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        return res.status(200).json(formattedFriends);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id: userId, friendId } = req.params;
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        // Check Friend List
        if(user.friends.includes(friendId)) {       // Remove Friend
            user.friends = user.friends.filter(id => id !== friendId);
            friend.friends = friend.friends.filter(id => id !== userId);
        } else {                                    // Add Friend
            user.friends.push(friendId);
            friend.friends.push(userId);
        }

        // Update the user and friend document
        await user.save();
        await friend.save();

        // Send back the friend list as a response
        const friends = await Promise.all(
            user.friends.map(async (id) => await User.findById(id))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        return res.status(200).json(formattedFriends);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}