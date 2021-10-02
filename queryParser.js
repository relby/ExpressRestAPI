module.exports = query => {
    let out = {}
    out.name = {}, out.price = {}, out.left = {}
    if (query.inStock !== undefined) out.left[JSON.parse(query.inStock.toLowerCase()) ? '$ne' : '$eq'] = 0
    else out.left['$gte'] = 0
    if (query.name !== undefined) out.name['$eq'] = query.name
    else out.name['$exists'] = true
    if (query.price !== undefined) out.price['$eq'] = Number(query.price)
    else out.price['$exists'] = true
    if (query.left !== undefined) out.left['$eq'] = Number(query.left)
    else out.left['$exists'] = true
    if (query.from !== undefined) out.price['$gte'] = query.from
    if (query.to !== undefined) out.price['$lte'] = query.to
    return out
}