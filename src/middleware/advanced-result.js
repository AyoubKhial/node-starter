const advancedResult = model => async (req, res, next) => {
    const { query } = req;
    const { fields, sort, expand, page = 1, size = 100 } = query;
    // select
    const projection = fields?.replace(/\,/g, ' ') || '';

    // sort
    const sortBy = sort?.replace(/\,/g, ' ') || '';

    // pagination
    const startIndex = (Number.parseInt(page, 10) - 1) * Number.parseInt(size, 10);
    const endIndex = Number.parseInt(page, 10) * Number.parseInt(size, 10);
    const total = await model.countDocuments();
    const pagination = {};
    if (endIndex < total) pagination.next = { page: Number.parseInt(page, 10) + 1, size: Number.parseInt(size, 10) };
    if (startIndex > 0) pagination.prev = { page: Number.parseInt(page, 10) - 1, size: Number.parseInt(size, 10) };

    // population
    const populate = expand?.replace(/\,/g, ' ') || '';

    // query
    const reqQuery = { ...query };
    const fieldsToExclude = ['fields', 'expand', 'sort', 'page', 'size'];
    fieldsToExclude.forEach(field => delete reqQuery[field]);
    const queryStr = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in|eq|ne|exists)\b/g, match => `$${match}`);

    const data = await model
        .find(JSON.parse(queryStr))
        .populate(populate)
        .select(projection)
        .sort(sortBy)
        .skip(startIndex)
        .limit(Number.parseInt(size, 10));

    res.advancedResult = { success: true, total, pagination, data };
    next();
};

module.exports = advancedResult;
