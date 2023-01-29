import { CreateHouseInput } from './dto/createHouse/createHouse.input';

export interface Icreate {
  createHouseInput: CreateHouseInput;
  reqUser: IreqUser;
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
  auth_method: number;
}
