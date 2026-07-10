import { NavigatorScreenParams } from '@react-navigation/native';
import { Donation } from '../services/commonService';

export type RootTabParamList = {
  'Donor Home': undefined;
  'Post Food': undefined;
  'History Log': undefined;
  'Expired': undefined;
  'Profile': undefined;
  'Available Food': undefined;
  'My Inventory': undefined;
  'My Task': undefined;
  'Live Feed': undefined;
  'My Requests': undefined;
  'Receiver Hub': undefined;
};

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  VerifyAccount: { email: string };
  MainTabs: NavigatorScreenParams<RootTabParamList> | undefined;
  FoodDetail: { donation: Donation };
  Verification: { donation: Donation };
  AdvancedVerification: { donation: Donation };
};
