import ratelimit from "../config/uptash.js"


const rateLimiter = async(req ,res,next)=>{
    try {
        const {success} = await ratelimit.limit("my-rate-limit")
        if(!success){
        return res.status(429).json({
            message:"Too many request ,Please try again"

        })
        }
        next()
    } catch (error) {
        console.log("Rate Limit error",error)
        next(error)
    }
}
export default rateLimiter