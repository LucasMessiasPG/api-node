class UserQueryBuilder{
    constructor(user){ this.user = user;}

    basic(query = {}, params = {}){

        if(!params.excludeDeletedAt) params.deleted_at = true;
        if(!params.excludeOtherOffice) params.excludeOtherOffice = true;

        if(params.excludeDeletedAt === true && !query["deleted_at"]){
            query["deleted_at"] = { "$exists": false }
        }

        if(params.excludeOtherOffice == true){
            if(this.user.office && !query["_id"]){
                query["_id"] = this.user.office._id
            }
        }
        
        return query;

    }
}

module.exports = UserQueryBuilder;