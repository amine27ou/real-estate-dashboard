import { Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Properties() {
  type SearchFilterType = {
    title: string;
    country: string;
    state: string;
    propertyType:string;
    status:string;
  };
  type State  = {
    countryCode:string,
    isoCode:string,
    latitude?:string | null,
    longitude?:string | null,
    name:string,
  }
  const [searchFilter, setSearchFilter] = useState<SearchFilterType>({
    title: "",
    country: "",
    state: "",
    propertyType:"",
    status:''
  });

  
  const [countryStates, setCountryStates] = useState<State[]>([]);
  useEffect(() => {
    if (searchFilter.country) {
      const states = State.getStatesOfCountry(searchFilter.country);
      setCountryStates(states);
    } else {
      setCountryStates([]);
    }
  }, [searchFilter.country]);

  const handleChange = (e: any) => {
    setSearchFilter({...searchFilter,[e.target.name]:e.target.value})
  };

  return (
    <div className="bg-[rgb(17,18,20)] p-10">
      <div className="flex flex-row items-center justify-between p-10">
        <h1 className="text-white text-xl">Property List</h1>
        <Link to='/properties/add' className="py-3 px-4 text-white bg-[rgb(72,96,233)] rounded-md">
          + Add Property
        </Link>
      </div>

      <div className="bg-[rgb(41,43,45)] rounded-md p-5">
        <div className="flex flex-row gap-3 items-center">
          <div>
            <input
              type="text"
              name="title"
              placeholder="Property Title"
              className="bg-[rgb(17,18,20)]  p-3 placeholder:text-gray-500 rounded-md outline-none text-white"
            />
          </div>
          
          <div>
            <select
              name="country"
              value={searchFilter.country}
              onChange={handleChange}
              className="bg-[rgb(17,18,20)]  p-3 placeholder:text-gray-500 rounded-md outline-none text-gray-500"
            >
              <option value="" disabled>
                 Any country
              </option>
              {Country.getAllCountries().map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              name="state"
              value={searchFilter.state}
              onChange={handleChange}
              className="bg-[rgb(17,18,20)] w-[300px] p-3 placeholder:text-gray-500 rounded-md outline-none text-gray-500"
            >
              <option value="" disabled>
                Any State
              </option>
              {countryStates.map((state:State) => (
                <option key={state.isoCode} value={state.name}>
                    {state.name}
                </option>
              ))}
            </select>
          </div>

              <div>
                <select 
                name='propertyType'
                value={searchFilter.propertyType}
                onChange={handleChange}
                className="bg-[rgb(17,18,20)] w-[300px] p-3 placeholder:text-gray-500 rounded-md outline-none text-gray-500"  
                >
                    <option value='' disabled selected>Any Type</option>
                    <option value='apartments'>Apartments</option>
                    <option value='houses'>Houses</option>
                    <option value='commercial'>Commercial</option>
                    <option value='garages'>Garages</option>
                    <option value='lots'>Lots</option>
                </select>
              </div>
              <div>
                <select 
                name='status'
                value={searchFilter.status}
                onChange={handleChange}
                className="bg-[rgb(17,18,20)] w-[300px] p-3 placeholder:text-gray-500 rounded-md outline-none text-gray-500"  
                >
                    <option value='' disabled selected>Any Status</option>
                    <option value='sell'>For Sell</option>
                    <option value='rent'>For Rent</option>
                </select>
              </div>

        </div>

        <div className="mt-5">
              <div>

              </div>
        </div>
      </div>
    </div>
  );
}
