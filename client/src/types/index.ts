export type Property = {
        _id:string;
        title: string;
        description: string;
        propertyType: string;
        country: string;
        state: string;
        price: number;
        beds: number;
        photo: string;
        surface: number;
        status: string;
}
export type SearchFilterType = {
    title: string;
    country: string;
    state: string;
    propertyType:string;
    status:string;
  };
 export type StateType  = {
    countryCode:string;
    isoCode:string;
    latitude?:string | null;
    longitude?:string | null;
    name:string;
}

export type AgentType = {
  _id:string;
  firstname: string;
    lastname: string;
    birthdate: string;
    phone: string;
    gender: string;
    country: string;
    state: string;
    zipcode:number;
    email: string;
    password: string;
    avatar:string;
    role:string;
}
