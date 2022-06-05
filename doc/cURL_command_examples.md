# Examples of some commonly used cURL commands

##Table of Contents
* [Login](#login)
* [Get list of Broking Companies](#get-list-of-broking-companies)
* [Get list of TPAs](#get-list-of-tpas)
* [Get list of Insurance Companies](#get-list-of-insurance-companies)
* [Get list of Corporates](#get-list-of-corporates)
* [Get list of Executives](#get-list-of-executives)
* [Add Executives](#add-executives)
* [Add Corporates](#add-corporates)
* [Update Corporate](#update-corporate)
* [Add Customers](#add-customers)
* [Update Customer](#update-customer)
* [Add Broking Companies](#add-broking-companies)
* [Add Insurance Companies](#add-insurance-companies)
* [Add Dependents to a Customer](#add-dependents-to-a-customer)
* [Add Network Hospitals into DB from FHPL SOAP service](#add-network-hospitals-into-db-from-fhpl-soap-service)
* [Add Network Hospitals into DB from MediAssist SOAP service](#add-network-hospitals-into-db-from-mediassist-soap-service)
* [Add Claims into DB from FHPL SOAP service](#add-claims-into-db-from-fhpl-soap-service)

## Login
```bash
curl --location --request POST 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/users/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "admin",
    "password": "vispass123",
    "role": "manager",
    "subdomain": "www.visista4u.com"
}
```

## Get list of Broking Companies
```bash
curl --location --request GET 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/BrokingCompanies' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiJjNDVkNzJlOS0yNzJjLTRlOGEtYjRlZC0yNDFiYmI5ZDAzNjUiLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiJhMTM4Nzg5NC1mMTgyLTQ1ZDktYTllMi0zYTkzNmY5ODRmYzAiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6Im1hbmFnZXIiLCJlbWFpbCI6IiIsIm1vYmlsZSI6IiIsImp3dCI6bnVsbCwiZW1waWQiOiIxMDAwMDAifSwiaWF0IjoxNTk5MTMyNDU5LCJleHAiOjE1OTkyMTg4NTl9.HfkGisVK_YBpRZ75kIhC4Q6Vmku9ronzivogcBIpZTQ'
```

## Get list of TPAs
```bash
curl --location --request GET 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/tpas' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiJjNDVkNzJlOS0yNzJjLTRlOGEtYjRlZC0yNDFiYmI5ZDAzNjUiLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiJhMTM4Nzg5NC1mMTgyLTQ1ZDktYTllMi0zYTkzNmY5ODRmYzAiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6Im1hbmFnZXIiLCJlbWFpbCI6IiIsIm1vYmlsZSI6IiIsImp3dCI6bnVsbCwiZW1waWQiOiIxMDAwMDAifSwiaWF0IjoxNTk5MTMyNDU5LCJleHAiOjE1OTkyMTg4NTl9.HfkGisVK_YBpRZ75kIhC4Q6Vmku9ronzivogcBIpZTQ'
```

## Get list of Insurance Companies
```bash
curl --location --request GET 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/insuranceCompanies' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiJjNDVkNzJlOS0yNzJjLTRlOGEtYjRlZC0yNDFiYmI5ZDAzNjUiLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiJhMTM4Nzg5NC1mMTgyLTQ1ZDktYTllMi0zYTkzNmY5ODRmYzAiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6Im1hbmFnZXIiLCJlbWFpbCI6IiIsIm1vYmlsZSI6IiIsImp3dCI6bnVsbCwiZW1waWQiOiIxMDAwMDAifSwiaWF0IjoxNTk5MTMyNDU5LCJleHAiOjE1OTkyMTg4NTl9.HfkGisVK_YBpRZ75kIhC4Q6Vmku9ronzivogcBIpZTQ'
```

## Get list of Corporates
```bash
curl --location --request GET 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/corporates' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiJjNDVkNzJlOS0yNzJjLTRlOGEtYjRlZC0yNDFiYmI5ZDAzNjUiLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiJhMTM4Nzg5NC1mMTgyLTQ1ZDktYTllMi0zYTkzNmY5ODRmYzAiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6Im1hbmFnZXIiLCJlbWFpbCI6IiIsIm1vYmlsZSI6IiIsImp3dCI6bnVsbCwiZW1waWQiOiIxMDAwMDAifSwiaWF0IjoxNTk5MTMyNDU5LCJleHAiOjE1OTkyMTg4NTl9.HfkGisVK_YBpRZ75kIhC4Q6Vmku9ronzivogcBIpZTQ'
```

## Get list of Executives
```bash
curl --location --request GET 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/executives' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiJjNDVkNzJlOS0yNzJjLTRlOGEtYjRlZC0yNDFiYmI5ZDAzNjUiLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiJhMTM4Nzg5NC1mMTgyLTQ1ZDktYTllMi0zYTkzNmY5ODRmYzAiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6Im1hbmFnZXIiLCJlbWFpbCI6IiIsIm1vYmlsZSI6IiIsImp3dCI6bnVsbCwiZW1waWQiOiIxMDAwMDAifSwiaWF0IjoxNTk5MTMyNDU5LCJleHAiOjE1OTkyMTg4NTl9.HfkGisVK_YBpRZ75kIhC4Q6Vmku9ronzivogcBIpZTQ'
```

## Add Executives
```bash
curl --location --request POST 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/executives' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiJjNDVkNzJlOS0yNzJjLTRlOGEtYjRlZC0yNDFiYmI5ZDAzNjUiLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiJhMTM4Nzg5NC1mMTgyLTQ1ZDktYTllMi0zYTkzNmY5ODRmYzAiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6Im1hbmFnZXIiLCJlbWFpbCI6IiIsIm1vYmlsZSI6IiIsImp3dCI6bnVsbCwiZW1waWQiOiIxMDAwMDAifSwiaWF0IjoxNTk5MTMyNDU5LCJleHAiOjE1OTkyMTg4NTl9.HfkGisVK_YBpRZ75kIhC4Q6Vmku9ronzivogcBIpZTQ' \
--header 'Content-Type: application/json' \
--data-raw '[{
  "empid": "100010",
  "brokingCompanyUuid": "a1387894-f182-45d9-a9e2-3a936f984fc0",
  "firstName": "Vinitha",
  "lastName": "Shukla",
  "email": "vinitha.s@visista.com",
  "mobile": "+914123456889",
  "supervisorEmpid": "",
  "designation": "executive"
}]'
```

## Add Corporates
```bash
curl --location --request POST 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/corporates' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiI3MzgwY2M1YS00M2EwLTQyZWYtOTFmYi1kMGNlMzBhNTY1M2EiLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiJmNmY3MDlmMS00ODM5LTQ0YmItOGYxYS04NjQxYzIzZGE1OTQiLCJ1c2VybmFtZSI6InVzZXIxIiwicm9sZSI6Im1hbmFnZXIiLCJlbWFpbCI6IiIsIm1vYmlsZSI6IiIsImp3dCI6bnVsbCwiZW1waWQiOiIxMDAwMjUifSwiaWF0IjoxNTk4Nzg1Nzc3LCJleHAiOjE1OTg4NzIxNzd9.zdbDFtUAuOoam49E-ICww0GQExzzHmDqhFWWEtj0rDI' \
--header 'Content-Type: application/json' \
--data-raw '[
    {
        "companyName": "NCL Dealers Welfare Trust3",
        "displayName": "NCL2",
        "branchCode": "1",
        "branchAddressBuildingName": "NCL Pearl",
        "branchAddressBuildingAddress": "7th Floor, Opp Hyderabad Bhawan, Near Rail Nilayam",
        "branchAddressStreet": "Sarojini Devi Road, East Maredpally",
        "branchAddressCity": "Secunderabad",
        "branchAddressDistrict": "Secunderabad",
        "branchAddressState": "Telangana",
        "branchAddressPincode": "500026",
        "lat": "17.440361",
        "long": "78.508135"
    }
]'
```

## Update Corporate
```bash
curl --location --request PUT 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/corporates' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiJjNDVkNzJlOS0yNzJjLTRlOGEtYjRlZC0yNDFiYmI5ZDAzNjUiLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiJhMTM4Nzg5NC1mMTgyLTQ1ZDktYTllMi0zYTkzNmY5ODRmYzAiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6Im1hbmFnZXIiLCJlbWFpbCI6IiIsIm1vYmlsZSI6IiIsImp3dCI6bnVsbCwiZW1waWQiOiIxMDAwMDAifSwiaWF0IjoxNTk5MDcyNzY5LCJleHAiOjE1OTkxNTkxNjl9.pMh6Gj_L0LYETk1ghYHtbcFY02eM9cMTLT-cMzuzldc' \
--header 'Content-Type: application/json' \
--data-raw '{
    "uuid": "204760d3-13d0-4c81-8b24-856ea4b3cd5a",
    "status": "approved",
    "companyName": "NCL Dealers Welfare Trust3",
    "displayName": "NCL2",
    "branchCode": "1",
    "branchAddressBuildingName": "NCL Pearl",
    "branchAddressBuildingAddress": "7th Floor, Opp Hyderabad Bhawan, Near Rail Nilayam",
    "branchAddressStreet": "Sarojini Devi Road, East Maredpally",
    "branchAddressCity": "Secunderabad",
    "branchAddressDistrict": "Secunderabad",
    "branchAddressState": "Telangana",
    "branchAddressPincode": "500026",
    "lat": "17.440361",
    "long": "78.508135"
}'
```

## Add Customers
```bash
curl --location --request POST 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/customers' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiJhODYyMWM2My0yZTM3LTQ5YjYtODk4My0zMTBiZjk1M2Y3NGQiLCJjb3Jwb3JhdGVVdWlkIjoiMDIwZjMzNzItNWI2MS00MTQyLWE2NzYtMzc4MjdjNTU1NGNiIiwiYnJva2luZ0NvbXBhbnlVdWlkIjpudWxsLCJ1c2VybmFtZSI6ImFtaXRrIiwicm9sZSI6ImhyIiwiZW1haWwiOiIiLCJtb2JpbGUiOiIiLCJqd3QiOm51bGwsImVtcGlkIjoiMTAwMDAxIn0sImlhdCI6MTU5NTg4MDc0NiwiZXhwIjoxNTk1OTY3MTQ2fQ.Yn73yUQBf-VfwGle_hHly4sQJR0lT_jDpUjrnrcg7As' \
--header 'Content-Type: application/json' \
--data-raw '[
    {
        "gender": "Male",
        "addressState": "",
        "empid": "C10182",
        "firstName": "Ratanji",
        "lastName": "Batliwala",
        "email": "",
        "addressBuildingName": "",
        "addressBuildingAddress": "21, ABC Street",
        "addressStreet": "",
        "addressCity": "Warangal",
        "addressState": "Telangana",
        "addressDistrict": "",
        "addressPincode": "506310",
        "contactFirstName": "Tara Deshpande",
        "contactLastName": "",
        "contactMobile": "",
        "contactEmail": "",
        "dob": "Tue Jul 21 2020 19:33:24 GMT+0530 (India Standard Time)",
        "corporateUuid": "020f3372-5b61-4142-a676-37827c5554cb"
    },
    {
        "gender": "Female",
        "addressState": "",
        "empid": "C10183",
        "firstName": "Lata",
        "lastName": "Kirloskar",
        "email": "",
        "addressBuildingName": "",
        "addressBuildingAddress": "21, ABC Street",
        "addressStreet": "",
        "addressCity": "Warangal",
        "addressState": "Telangana",
        "addressDistrict": "",
        "addressPincode": "506310",
        "contactFirstName": "Tara Deshpande",
        "contactLastName": "",
        "contactMobile": "",
        "contactEmail": "",
        "dob": "Tue Jul 21 2020 19:33:24 GMT+0530 (India Standard Time)",
        "corporateUuid": "020f3372-5b61-4142-a676-37827c5554cb"
    }
]'
```

## Update Customer
```bash
curl --location --request PUT 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/customers' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiJlYTE1MGVhMS0xZGZlLTQ1OWMtYjgxMC1kNDkwYzcyMjA1NWYiLCJ1c2VybmFtZSI6InVzZXIyIiwicm9sZSI6ImV4ZWN1dGl2ZSIsImVtYWlsIjoiIiwibW9iaWxlIjoiIiwiand0IjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiI0YTIzZWFlMi0zNjA2LTRlMjYtOWQzYi00NzI4MTgxNWQwYjciLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJlbXBpZCI6IjEwMDAxMCJ9LCJpYXQiOjE1OTU0NDEzNDAsImV4cCI6MTU5NTUyNzc0MH0.f32T3wIIHWDbZ_gCk-WAjtkxbqkgKn_9wO1cYVYFoAg' \
--header 'Content-Type: application/json' \
--data-raw '[
    {
        "uuid": "f182470d-4247-4e90-8f8e-8bef38fa8353",
        "status": "hr approved",
        "approvalType": "addition"
    }
]'
```

## Add Broking Companies
```bash
$ curl --location --request POST 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/brokingCompanies' --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiJlYTE1MGVhMS0xZGZlLTQ1OWMtYjgxMC1kNDkwYzcyMjA1NWYiLCJ1c2VybmFtZSI6InVzZXIyIiwicm9sZSI6ImV4ZWN1dGl2ZSIsImVtYWlsIjoiIiwibW9iaWxlIjoiIiwiand0IjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiI0YTIzZWFlMi0zNjA2LTRlMjYtOWQzYi00NzI4MTgxNWQwYjciLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJlbXBpZCI6IjEwMDAxMCJ9LCJpYXQiOjE1OTU0NDEzNDAsImV4cCI6MTU5NTUyNzc0MH0.f32T3wIIHWDbZ_gCk-WAjtkxbqkgKn_9wO1cYVYFoAg' \
--header "Content-Type: application/json" \
--data-raw '[
{
    "companyName": "BeSayfe Insurance Broking Services Pvt Ltd", 
    "displayName": "BeSayfe", 
    "branchCode": "1", 
    "branchAddressBuildingName": "Plot no-177", 
    "branchAddressBuildingAddress": "Phase-II, Kamalapuri Colony", 
    "branchAddressStreet": "", 
    "branchAddressCity": "Hyderabad", 
    "branchAddressDistrict": "Hyderabad", 
    "branchAddressState": "Telangana", 
    "branchAddressPincode": "500073", 
    "lat": "17.430833", 
    "long": "78.43", 
    "contactFirstName": "Ashok", 
    "contactLastName": "Kumar", 
    "contactMobile": "+914040176990", 
    "contactEmail": "ashok.kumar@visista.com", 
    "contactGstNumber": "22AAAAA0000A1Z5", 
    "active": true 
}, 
{ 
    "companyName": "JeevanSuraksha Insurance Broking Services Pvt Ltd", 
    "displayName": "JeevanSuraksha", 
    "branchCode": "2", 
    "branchAddressBuildingName": "Plot no-177", 
    "branchAddressBuildingAddress": "Phase-II, Kamalapuri Colony", 
    "branchAddressStreet": "", 
    "branchAddressCity": "Hyderabad", 
    "branchAddressDistrict": "Hyderabad", 
    "branchAddressState": "Telangana", 
    "branchAddressPincode": "500073", 
    "lat": "17.430833", 
    "long": "78.43", 
    "contactFirstName": "Kishore", 
    "contactLastName": "Kumar", 
    "contactMobile": "+914040176990", 
    "contactEmail": "kishore.kumar@visista.com", 
    "contactGstNumber": "22AAAAA0000A1Z5", 
    "active": true 
}
]'
```

## Add Insurance Companies
```bash
curl --location --request POST 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/insuranceCompanies' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiI2YTdkNDdhOS0xOGJmLTQ2ODUtOTAzMy01MGM0ODM3ZjUwMDQiLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiJkMDE1OTVkZS0xYjkyLTQxOWMtYTVkOC05ZWI3NTlhYzc2OTgiLCJ1c2VybmFtZSI6InVzZXIxIiwicm9sZSI6Im1hbmFnZXIiLCJlbWFpbCI6IiIsIm1vYmlsZSI6IiIsImp3dCI6bnVsbCwiZW1waWQiOiIxMDAwMjUifSwiaWF0IjoxNTk4NDI0NjAwLCJleHAiOjE1OTg1MTEwMDB9.xJcUiM6k2YK9H16XdIbcQFBSnhBpPAVvoFqIvPK3xFA' \
--header 'Content-Type: application/json' \
--data-raw '[
    {
        "companyName": "Reliance General Insurance Co. Ltd.",
        "displayName": "Reliance_General",
        "branchCode": "1",
        "branchAddressBuildingName": "Sample",
        "branchAddressBuildingAddress": "Sample",
        "branchAddressStreet": "",
        "branchAddressCity": "Sample",
        "branchAddressDistrict": "Sample",
        "branchAddressState": "Sample",
        "branchAddressPincode": "400011",
        "lat": "18.987968",
        "long": "72.826766",
        "contactFirstName": "Ganesh",
        "contactLastName": "K",
        "contactMobile": "+918040176991",
        "contactEmail": "ganesh.k@nia.com",
        "contactGstNumber": "32AACCM8044R1Z2"
    },
    {
        "companyName": "The Oriental Insurance Co. Ltd.",
        "displayName": "OIC",
        "branchCode": "1",
        "branchAddressBuildingName": "Sample",
        "branchAddressBuildingAddress": "Sample",
        "branchAddressStreet": "",
        "branchAddressCity": "Sample",
        "branchAddressDistrict": "Sample",
        "branchAddressState": "Sample",
        "branchAddressPincode": "400011",
        "lat": "18.987968",
        "long": "72.826766",
        "contactFirstName": "Ganesh",
        "contactLastName": "K",
        "contactMobile": "+918040176991",
        "contactEmail": "ganesh.k@nia.com",
        "contactGstNumber": "32AACCM8044R1Z2"
    }
]'
```

## Add Dependents to a Customer
```bash
$ curl --location --request POST 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1/customers/PUT-CUSTOMER-EMPID-HERE/dependents' \
--header "Content-Type: application/json" \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InV1aWQiOiI2YTdkNDdhOS0xOGJmLTQ2ODUtOTAzMy01MGM0ODM3ZjUwMDQiLCJjb3Jwb3JhdGVVdWlkIjpudWxsLCJicm9raW5nQ29tcGFueVV1aWQiOiJkMDE1OTVkZS0xYjkyLTQxOWMtYTVkOC05ZWI3NTlhYzc2OTgiLCJ1c2VybmFtZSI6InVzZXIxIiwicm9sZSI6Im1hbmFnZXIiLCJlbWFpbCI6IiIsIm1vYmlsZSI6IiIsImp3dCI6bnVsbCwiZW1waWQiOiIxMDAwMjUifSwiaWF0IjoxNTk4NDI0NjAwLCJleHAiOjE1OTg1MTEwMDB9.xJcUiM6k2YK9H16XdIbcQFBSnhBpPAVvoFqIvPK3xFA' \
--data-raw '[
  { 
    "relationship": "mother",
    "firstName": "Dependent",
    "lastName": "1",
    "gender": "F",
    "addressBuildingName": null,
    "addressBuildingAddress": "Viliyatthu Illam",
    "addressStreet": "4th Main, 5th Cross, BEL Layout, Vidyaranyapura",
    "addressCity": "Bengaluru",
    "addressDistrict": "Bengaluru Urban",
    "addressState": "Karnataka",
    "addressPincode": "560035",
    "lat": "13.083959",
    "long": "77.5624813",
    "contactFirstName": "Self",
    "contactLastName": "Self",
    "contactMobile": null,
    "contactEmail": null,
    "dob": "1941-01-01" 
  }, 
  {
    "relationship": "father",
    "firstName": "Dependent",
    "lastName": "2",
    "gender": "M",
    "addressBuildingName": "Viliyatthu Illam",
    "addressBuildingAddress": "4th Main, 5th Cross, BEL Layout",
    "addressStreet": "Vidyaranyapura",
    "addressCity": "Bengaluru",
    "addressDistrict": "Bengaluru Urban",
    "addressState": "Karnataka",
    "addressPincode": "560035",
    "lat": "13.083959",
    "long": "77.5624813",
    "contactFirstName": "Self",
    "contactLastName": "Self",
    "contactMobile": null,
    "contactEmail": null,
    "dob": "1933-02-01" 
  }
]'
```

## Add Network Hospitals into DB from FHPL SOAP service
```bash
curl --header "Content-Type: application/json" --request POST 'http://localhost/api/v1/networkHospitals?startIndex=1&endIndex=2000&insuranceCompanyUuid=69a66da2-2d81-4e69-854d-3ab84421978b&tpaUuid=d7bf8d2e-0839-494d-a33f-69812737a8f7'
```

_tpaUuid_ is the UUID of FHPL from the table TPAs.

_insuranceCompanyUuid_ is the UUID of "LIC of India" from the table InsuranceCompanies.


## Add Network Hospitals into DB from MediAssist SOAP service
```bash
curl --location --header 'Authorization: MANAGER or EXECUTIVE JWT' --request POST 'http://localhost/api/v1/networkHospitals?startIndex=1&endIndex=1&insuranceCompanyUuid=46e2837b-fb7f-487d-8fb6-c011bb95c2c0&tpaUuid=72101565-329d-4372-865a-cececb7ee6f6'
```

_tpaUuid_ is the UUID of MediAssist from the table TPAs.

_insuranceCompanyUuid_ is the UUID of Bharathi AXA from the table InsuranceCompanies.


## Add Claims into DB from FHPL SOAP service
```bash
curl --header "Content-Type: application/json" --header 'Authorization: MANAGER or EXECUTIVE JWT' --request GET 'http://localhost/api/v1/claims2/fhpl_claims?policy=556004501910000053&fromDate=2018-01-01&toDate=2020-07-31'
```

_policy_ is the value of "policyId" received from table Policies. This is a well known policy id received from FHPL and used as is to get Claims from the FHPL SOAP service.

## Add Claims into DB from MediAssist SOAP service
```bash
curl --header "Content-Type: application/json" --header 'Authorization: MANAGER or EXECUTIVE JWT' --request GET 'http://localhost/api/v1/claims2/mediassist_claims?policy=GHA/Q1725702/51&fromDate=2018-01-01&toDate=2020-07-31'
```

_policy_ is the value of "policyId" received from table Policies. This is a well known policy id received from FHPL and used as is to get Claims from the FHPL SOAP service.
