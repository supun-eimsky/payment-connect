'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, UserFormProps } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { Company, CompanyFilters } from '@/types/company';
import { Organisation, OrganisationFilters } from '@/types/organisations';
import { apiService } from '@/services/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
////set Organisation_ID
const userStr = localStorage.getItem("user")
let Organisation_ID: any = null;
let COMPANY_ID: any = null;
if (userStr) {
  const parsed = JSON.parse(userStr);
  Organisation_ID = parsed.organisation_id ? (parsed.organisation_id) : (null);
  COMPANY_ID = parsed.company_id ? (parsed.company_id) : (null)
}

export default function UserForm({
  companyId,
  OrganisationId,
  initialData,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [formData, setFormData] = useState<User>({
    user_type: '',
    email: '',
    phone: '',
    password: '',
    first_name: '',
    last_name: '',
    national_id: '',
    company_id: companyId || null,
    organisation_id: null,
    license_number: null,
    id: null
  });
  const { token } = useAuth();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof User | 'confirmPassword', string>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [companies, setcompanies] = useState<Company[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [userTypeArray, setUserTypeArray] = useState([
    {
      lable: "System",
      value: "system",
      visible:  Organisation_ID || COMPANY_ID ? false : true
    },
    {
      lable: "Organisation Admin",
      value: "organisation_admin",
      visible:  COMPANY_ID ? false : true
    },
    {
      lable: "Company Owner",
      value: "company_owner",
       visible:  true
    },
    {
      lable: "Company Admin",
      value: "company_admin",
       visible:  true
    },
    {
      lable: "Driver",
      value: "driver",
      visible: true
    },
    {
      lable: "Conductor",
      value: "conductor",
      visible: true
    }]);


  const [companiesId, setCompaniesId] = useState<string>('');
  const [userType, setUserType] = useState<string>("");
  const [selectUserType, setSelectUserType] = useState<string>("");
  const [filters, setFilters] = useState<CompanyFilters>({
    organisation_id: Organisation_ID,
    offset: 0,
    limit: 100,

  });
  const STSTUS_LIST = [
    {
      "lable": "Active",
      "value": "active"
    },
    {
      "lable": "Inactive",
      "value": "inactive"
    }
  ];
  useEffect(() => {

    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserType(parsedData.user_type)
      if (parsedData.user_type == "system") {
        fetchCompanies(filters)
        fetchOrganisations(filters)
      } else if (parsedData.user_type == "organisation_admin") {
        fetchCompanies(filters)
      } else {
        setCompaniesId(parsedData.company_id)
      }
    }

    if (initialData) {
      setFormData(initialData);
      // Don't set password for edit mode for security
      setFormData(prev => ({ ...prev, password: '' }));
    }
  }, [initialData]);

  const fetchOrganisations = async (filterData: any) => {
    console.log("fetchOrganisations filterData", filterData);
    if (!token) return;
    try {

      // Call with filter
      setLoading(true)
      const data = await apiService.getOrganisationsWithFilters(token, null, filterData);
      const busesArray = data || [];
      setOrganisations(busesArray.data);
      console.log('Organisations Details Data:', busesArray);
    } catch (err: any) {
      console.error('Organisations to fetch bus', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }

  }

  const fetchCompanies = async (filterData: any) => {
    if (!token) return;
    try {

      // Call with filter
      setLoading(true)
      const data = await apiService.getCompaniesWithFilters(token, null, filterData);
      const busesArray = data || [];
      setcompanies(busesArray.data);
      console.log('Company Details Data:', busesArray);
    } catch (err: any) {
      console.error('Company to fetch bus', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }

  }

  const handleChange = (field: keyof User, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time validation for specific fields
    if (field === 'email') {
      validateEmailRealtime(value as string);
    }

    if (field === 'password') {
      validatePasswordRealtime(value as string);
    }
    if (field === 'user_type') {
      setSelectUserType(value as string);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmailRealtime = (email: string) => {
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
    } else if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validatePasswordRealtime = (password: string) => {
    if (!password && !initialData) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
    } else if (password && password.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters long' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }

    // Also validate confirm password when password changes
    if (confirmPassword) {
      validateConfirmPasswordRealtime(confirmPassword, password);
    }
  };

  const validateConfirmPasswordRealtime = (confirm: string, password?: string) => {
    const passwordToCheck = password !== undefined ? password : formData.password;

    if (!confirm && (!initialData || formData.password)) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Please confirm your password' }));
    } else if (confirm && passwordToCheck !== confirm) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof User | 'confirmPassword', string>> = {};

    // Required fields validation

    if (!(formData.email || '').trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email || "")) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!(formData.phone || "").trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone || "")) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    // Password validation (only for new users or if password is being changed)
    if (!initialData) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
     
      if (!(formData.user_type || '').trim()) {
        newErrors.user_type = 'User type is required';
      }

    }

    if (!(formData.first_name || "").trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!(formData.last_name || "").trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!(formData.national_id || "").trim()) {
      newErrors.national_id = 'National ID is required';
    }

    // if (!formData.organisation_id) {
    //   newErrors.organisation_id = 'Organisation is required';
    // }



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log(formData)
    console.log(validate())

    if (!validate()) return;

    // Remove confirmPassword before submitting
    const { ...submitData } = formData;
    onSubmit(submitData);
  };

  return (
    <div className="px-1 lg:px-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {initialData ? 'Edit User' : 'Add New User'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h1> User Details</h1>
            <div data-orientation="horizontal" role="none" data-slot="separator" className="bg-border mb-6 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  Organisation *
                </Label>
                <Input
                  placeholder="Enter organisation ID"
                  value={formData.organisation_id || ''}
                  onChange={(e) => handleChange('organisation_id', e.target.value)}
                />
                {errors.organisation_id && (
                  <p className="text-red-500 text-sm">{errors.organisation_id}</p>
                )}
              </div> */}
              {!initialData ? (<div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  User Type *
                </Label>

                <Select
                  value={formData.user_type ? String(formData.user_type) : ''}
                  onValueChange={(value) => handleChange('user_type', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypeArray.map((item, index) => (
                      item.visible && <SelectItem key={item.value} value={item.value}>
                        {item.lable}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>



                {errors.user_type && (
                  <p className="text-red-500 text-sm">{errors.user_type}</p>
                )}
              </div>) : ("")}
              {!initialData && selectUserType == "organisation_admin" ? (<div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  Organisation *
                </Label>
                {userType == "system" ? (<Select
                  value={formData.organisation_id ? String(formData.organisation_id) : ''}
                  onValueChange={(value) => handleChange('organisation_id', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Organisation" />
                  </SelectTrigger>
                  <SelectContent>
                    {organisations.map((item, index) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>) : (<Input id="organisation_id" value={OrganisationId ?? ''} disabled className="bg-gray-100" />)}


                {errors.organisation_id && (
                  <p className="text-red-500 text-sm">{errors.organisation_id}</p>
                )}
              </div>) : ('')}
              {!initialData && (selectUserType == "company_admin" || selectUserType == "company_owner"|| selectUserType == "driver" || selectUserType == "conductor") ? (<div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  Company ID *
                </Label>
                {userType == "organisation_admin" || userType == "system" ? (<Select
                  value={formData.company_id ? String(formData.company_id) : ''}
                  onValueChange={(value) => handleChange('company_id', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((item, index) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>) : (<Input id="company_id" value={companyId ?? ''} disabled className="bg-gray-100" />)}


                {errors.company_id && (
                  <p className="text-red-500 text-sm">{errors.company_id}</p>
                )}
              </div>) : ('')}




              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  First Name *
                </Label>
                <Input
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm">{errors.first_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  Last Name *
                </Label>
                <Input
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm">{errors.last_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  National ID *
                </Label>
                <Input
                  placeholder="Enter national ID"
                  value={formData.national_id}
                  onChange={(e) => handleChange('national_id', e.target.value)}
                />
                {errors.national_id && (
                  <p className="text-red-500 text-sm">{errors.national_id}</p>
                )}
              </div>
              {selectUserType == "driver" || selectUserType == "conductor" ? (<div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  License Number
                </Label>
                <Input
                  placeholder="Enter license number (optional)"
                  value={formData.license_number || ''}
                  onChange={(e) => handleChange('license_number', e.target.value)}
                />
                {errors.license_number && (
                  <p className="text-red-500 text-sm">{errors.license_number}</p>
                )}
              </div>) : ("")}

            </div>

            <h1> Login Details</h1>
            <div data-orientation="horizontal" role="none" data-slot="separator" className="bg-border mb-6 shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  Email *
                </Label>
                <Input
                  placeholder="example@email.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
                {!errors.email && formData.email && validateEmail(formData.email) && (
                  <p className="text-green-600 text-sm">✓ Valid email address</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  Phone *
                </Label>
                <Input
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">Status*</Label>
                <Select
                  value={formData.status ? String(formData.status) : ''}
                  onValueChange={(value) => handleChange('status', String(value))}
                >
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STSTUS_LIST.map((cap) => (
                      <SelectItem key={cap.value} value={cap.value.toString()}>
                        {cap.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.status && (
                  <p className="text-red-500 text-sm">{errors.status}</p>
                )}
              </div>
              {!initialData ? (<><div className="space-y-2">
                <Label className="block text-gray-700 font-medium mb-2">
                  Password {!initialData && '*'}
                </Label>
                <Input
                  type="password"
                  placeholder={initialData ? 'Leave blank to keep current' : 'Minimum 8 characters'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
                {!errors.password && formData.password && formData.password.length >= 8 && (
                  <p className="text-green-600 text-sm">✓ Password meets requirements</p>
                )}
              </div>

                <div className="space-y-2">
                  <Label className="block text-gray-700 font-medium mb-2">
                    Confirm Password {!initialData && '*'}
                  </Label>
                  <Input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      validateConfirmPasswordRealtime(e.target.value);
                    }}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                  )}
                  {!errors.confirmPassword && confirmPassword && formData.password === confirmPassword && (
                    <p className="text-green-600 text-sm">✓ Passwords match</p>
                  )}
                </div>
              </>) : ("")}



            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                className="h-11 rounded-12 px-6"
                variant="outline"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-400 hover:bg-blue-600 text-white h-11 rounded-12 px-6"
                onClick={handleSubmit}
              >
                {initialData ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}