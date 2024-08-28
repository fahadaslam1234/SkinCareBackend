exports.success = (res, data) => {
    res.status(200).json(data);
};

exports.error = (res, message, status, error) => {
    res.status(status || 500).json({
        message,
        error
    });
};
