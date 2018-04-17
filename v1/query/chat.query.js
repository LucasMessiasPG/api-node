class ChatQueryBuilder{
    constructor(user){ this.user = user;}

    basic(query = {}, params = {}){

        if(!params.excludeDeletedAt) params.excludeDeletedAt = true;

        if(params.excludeDeletedAt === true && !query["deleted_at"]){
            query["deleted_at"] = { "$exists": false }
        }

        return query;

    }
}

module.exports = ChatQueryBuilder;