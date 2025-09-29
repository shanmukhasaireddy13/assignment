import userModel from "../models/usermodel.js";

export const getUserData = async (req,res)=>{
    try {
        const {userId} = req.body;

        const user = await userModel.findById(userId);
        if(!user){
            res.json({success: false, message: 'User not found' });
        }
        res.json({
            success: true,
            userData:{
                name: user.name,
                role: user.role
            }
        });

        
    } catch (error) {
        res.json({success: false, message: error.message });
        
    }
} 