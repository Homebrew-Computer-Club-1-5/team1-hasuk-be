import { createHouseInput } from './dto/createHouse.input';

export interface Icreate {
  houseData: createHouseInput;
  user_auth_id: string;
  auth_method: number;
}

// export interface IhouseData {
//   contact_number?: string;
//   university_id?: number;
//   region_id?: number;
//   house_location: Ihouse_location;
//   month_cost?: number;
//   deposit?: number;
//   cost_other_info?: string;
//   gender?: number;
//   house_category_id?: number;
//   house_other_info?: string;
// }

// interface Ihouse_location {
//   latitude: number;
//   longitude: number;
// }

export interface IreqUser {
  user_auth_id: string;
  name: string;
}
