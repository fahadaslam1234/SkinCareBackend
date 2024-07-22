module.exports = async function (app) {
    try {
        let routes = {
            authRouter: require('./auth'),
            productRouter: require('./product'),
        }
        let base_version = '/api/v1'
        app.use(`${base_version}/authentication/`, routes.authRouter);
        app.use(`${base_version}/product`, routes.productRouter) ;
        app.use(`${base_version}/recommendation`, routes.recommendationRouter);    
    } catch (err) {
        console.log("ERROR: ", err)
    }
}