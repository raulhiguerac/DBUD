class GetAllError extends Error {
    constructor(componentName: string){
        super(`Failed to retrieve ${componentName} list`)
        this.name = "Get All Error"
    }
}

class CreationError extends Error {
    constructor(componentName: string){
        super(`Failed to retrieve ${componentName} list`)
        this.name = "Creation All Error"
    }
}

class UpdateError extends Error {
    constructor(componentName: string){
        super(`Failed to update ${componentName}`)
        this.name = "Update Error"
    }
}

class DeleteError extends Error {
    constructor(componentName: string){
        super(`Failed to delete ${componentName}`)
        this.name = "Delete error"
    }
}


class RecordNotFoundError extends Error {
    constructor(){
        super("Record has not found yet")
        this.name = "Register not found"
    }
}

export {
    GetAllError,
    CreationError,
    RecordNotFoundError,
    UpdateError,
    DeleteError
}