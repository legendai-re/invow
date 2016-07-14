export class Image {

    public _id: string;
    public type;
    public mime: string;
    public baseUrl: string;

    constructor(_id?: string, type?: Object | string, mime?: string, baseUrl?: string) {
        var types = Image.getTypes();
        this._id = _id;
        this.type = typeof type === 'string' ? types[type] : type;
        this.mime = mime;
        this.baseUrl = baseUrl;
    }

    public static createFormJson(obj){
        if(!obj) return new Image();
        return new Image(
            obj._id,
            obj.type,
            obj.mime,
            obj.baseUrl
        );
    }

    public static getTypes(){
        return require('../../../server/models/image/imageTypes.json');
    }

    public getPath(size: string){
        return this.baseUrl + '/' + this.type.path +'/'+ size + '/' + this._id + '.' + this.mime;
    }
}