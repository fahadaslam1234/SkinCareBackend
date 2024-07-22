const axios = require('axios');
const response = require('../../helpers/response');

exports.getRecommendation = async (req, res) => {
    const userInput = req.body;
    console.log(userInput);

    try {
        const result = await axios.post('http://localhost:5000/recommend', userInput);
        console.log(result.data);
        console.log(res);
        return response.success(res, result.data);
    } catch (error) {
        // return response.error(res, 'Error getting recommendations', 500, error.message);
    }
};
