export type Property = {
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
    countryCode:string,
    isoCode:string,
    latitude?:string | null,
    longitude?:string | null,
    name:string,
}
