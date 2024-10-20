const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");

class CrudRepository{
  constructor(model){
    this.model = model;
  }

  async create(data){
    const response = await this.model.create(data);
    return response;
  }
  

  async destroy(id){
    const response = await this.model.destroy({
      where:{
        id:id
      }
    });
    if(!response){
      throw new AppError('Requested item not found',StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async get(data){
    const response = await this.model.findByPk(data);
    if(!response){
      throw new AppError('Requested item not found',StatusCodes.NOT_FOUND);
    }
    return response;
    
  }

  async getAll(){
    const response = await this.model.findAll();
    return response;
  }

  async update(id,data){ // data->{}, should be a object;
    const response = await this.model.update(data,{
      where:{
        id:id
      }
    })
    if(!response[0]){
      throw new AppError('Requested item not found',StatusCodes.NOT_FOUND);
    }
    return response[0];
  }
}

module.exports = CrudRepository;