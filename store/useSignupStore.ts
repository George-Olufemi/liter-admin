import { create } from "zustand";

type SignupState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  password: string;

  setField: (field: string, value: string) => void;
  reset: () => void;
};

export const useSignupStore = create<SignupState>((set) => ({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  city: "",
  state: "",
  password: "",

  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),

  reset: () => ({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    password: "",
  }),
}));
