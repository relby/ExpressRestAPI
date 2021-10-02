const ELEMENTS_ON_PAGE = 5
module.exports = { ELEMENTS_ON_PAGE }

module.exports.queryParser = query => {
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
    if (query.priceFrom !== undefined) out.price['$gte'] = query.priceFrom
    if (query.priceTo !== undefined) out.price['$lte'] = query.priceTo
    if (query.leftFrom !== undefined) out.left['$gte'] = query.leftFrom
    if (query.leftTo !== undefined) out.left['$lte'] = query.leftTo
    return out
}

module.exports.checkPaging = (elemOnPage, page) => {
    if (elemOnPage === undefined) return {}
    elemOnPage = parseInt(elemOnPage)
    page = parseInt(page)
    elemOnPage = elemOnPage > 0 ? elemOnPage : ELEMENTS_ON_PAGE
    page = page > 0 ? page : 1
    return {
        skip: elemOnPage * (page - 1),
        limit: elemOnPage
    }
}