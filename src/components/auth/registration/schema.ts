import * as yup from 'yup'
import { RegistrationFormData } from './types'

export const registrationSchema: yup.SchemaOf<RegistrationFormData> = yup.object({
  fullName: yup.string().required('Full name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  country: yup.string().required('Country is required'),
  zipCode: yup.string().required('ZIP/Postal code is required'),
  allowLocationPermission: yup.boolean().required(),
  agreeToTerms: yup.boolean().oneOf([true], 'You must agree to the terms and conditions to continue').required(),
  marketingOptIn: yup.boolean().required(),
  shoeSize: yup.string().notRequired(),
  favoriteBrands: yup.array().of(yup.string()).notRequired(),
  buyingPreference: yup.mixed<'buying' | 'selling' | 'both'>().oneOf(['buying', 'selling', 'both']).notRequired(),
  // Identity fields are optional during registration
  idFront: yup.string().notRequired(),
  idBack: yup.string().notRequired(),
  idParsed: yup.object().notRequired()
})
