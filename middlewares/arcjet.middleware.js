import aj from '../config/arcjet.js';


const arcjetMiddleware = async (req, res, next) => {

    try {
        const decision = await aj.protect(
            req,
            {requested: 1}
        );

        if (decision.isDenied()){
            // rate limit
            if(decision.reason.isRateLimit()) {
                return res.status(429).json({
                    error: 'Too many requests. Please take a break.'
                })
            }

            // Bot detection
            if(decision.reason.isBot()){
                return res.status(403).json({
                    error: 'Bot detected.'
                })
            }

            // For other reasons:
            return res.status(403).json({
                error: 'Acces denied.'
            })
        }

        // Authorize
        next();
    } catch (error) {
        console.log(`Arcjet Middleware Error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;