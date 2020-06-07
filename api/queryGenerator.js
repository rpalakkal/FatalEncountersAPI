var ObjectID = require('mongodb').ObjectID;
const filterArray = ['age', 'year', 'race', 'cause', 'gender', 'state', 'next']
const filters = {
    'age':filterAge,
    'year':filterYear,
    'race':filterRace,
    'cause':filterCauseOfDeath,
    'gender':filterGender,
    'state':filterState,
    'next':paginate
}

function createQuery(requestQuery){
    queryObject = {'$and':[]}
    Object.keys(requestQuery).forEach((key)=>{
        if(filterArray.includes(key)){
            queryObject['$and'].push(filters[key](requestQuery[key]))
        }else{
            console.log('error')
        }
    })

    if(!queryObject['$and'].length){
        return {}
    }
    console.log(queryObject)
    return queryObject
    
    
}

function paginate(query){
    return {'_id': {$gt: ObjectID(query)}}
}

function filterAge(query){
    if(Number.isInteger(query)){
        return {year:{$eq: parseInt(query)}}
    }else{
        return {age:{$gte: parseInt(query.start), $lte: parseInt(query.end)}}
    }
    
}

function filterYear(query){
    if(Number.isInteger(query)){
        return {year:{$eq: parseInt(query)}}
    }else{
        return {year:{$gte: parseInt(query.start), $lte: parseInt(query.end)}}
    }   
}

function filterRace(query){
    if(!Array.isArray(query)){
        query = [query]
    }
    return {race:{$in: query}}
}

function filterCauseOfDeath(query){
    if(!Array.isArray(query)){
        query = [query]
    }
    return {cause:{$in: query}}
}

function filterGender(query){
    
    if(!Array.isArray(query)){
        query = [query]
    }
    return {gender:{$in: query}}
}

function filterState(query){
    
    if(!Array.isArray(query)){
        query = [query]
    }
    return {state:{$in: query}}
}

exports.createQuery = createQuery
