class OrderQueryBuilder{
    constructor(user){ this.user = user }

    basic(query = {}, params = {}){

        if(!params.excludeDeletedAt) params.excludeDeletedAt = true;
        if(!params.excludeOtherWorkSpace) params.excludeOtherWorkSpace = true;
        if(!params.excludeOtherOffice) params.excludeOtherOffice = true;

        if(params.excludeDeletedAt === true && !query["deleted_at"]){
            query["deleted_at"] = { "$exists": false }
        }

        if(params.excludeOtherWorkSpace == true){
            if(this.user.office && this.user.office.work_space && !query["work_spaces._id"]){
                query["work_spaces._id"] = { $in: this.user.office.work_space.map(item => item._id ) }
            }
        }
        
        return query;
    }
}

module.exports = OrderQueryBuilder;