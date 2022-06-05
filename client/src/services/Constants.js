const BASE_URL =
  // 'http://ec2-13-234-213-178.ap-south-1.compute.amazonaws.com/api/v1';
  // 'http://15.207.211.129/api/v1'; // Production DB
  '/api/v1';
export const LOCALHOST_SUB_DOMAIN_BASE_URL = 'www.visista4u.com/';

export const EMP_CONST = {
  EXECUTIVE_MENU_LIST: [
    { name: 'MIS', icon: 'chart-bar', link: 'executive-home/mis' },
    { name: 'Executives', icon: 'building', link: 'executive-home/executives' },
    { name: 'Corporates', icon: 'building', link: 'executive-home' },
    { name: 'Policies', icon: 'list-alt', link: 'executive-home/policies' },
    { name: 'Employees', icon: 'users', link: 'executive-home/employees' },
    { name: 'Claims', icon: 'notes-medical', link: 'executive-home/claims' },
    { name: 'Hospitals', icon: 'hospital', link: 'executive-home/hospitals' },
    { name: 'Services', icon: 'cogs', link: 'executive-home/services' },
  ],
  EXECUTIVE_MIS_SUB_MENU: [
    { name: 'Claims Report', icon: '', link: 'claims-report' },
    { name: 'Premium Report', icon: '', link: 'policy-premium-report' },
  ],
  EXECUTIVE_EXECUTIVES_SUB_MENU: [
    { name: 'List Executives', icon: '', link: 'list-executives' },
    { name: 'Add Executive', icon: '', link: 'add-executive' },
  ],
  EXECUTIVE_CORPORATES_SUB_MENU: [
    { name: 'List Corporates', icon: '', link: 'list-corporates' },
    { name: 'Add Corporate', icon: '', link: 'add-corporate' },
  ],
  EXECUTIVE_POLICIES_SUB_MENU: [
    { name: 'List Policies', icon: '', link: 'list-policies' },
    { name: 'Add Policy', icon: '', link: 'add-policy' },
  ],
  EXECUTIVE_EMPLOYEES_SUB_MENU: [
    { name: 'Pending Actions', icon: '', link: 'pending-actions' },
    { name: 'Employees/Dependents', icon: '', link: 'list-employees' },
    { name: 'Add Employee', icon: '', link: 'add-employee' },
    { name: 'Bulk Upload Employee', icon: '', link: 'bulk-upload-employee' },
    {
      name: 'Bulk Upload Dependents',
      icon: '',
      link: 'bulk-upload-dependents',
    },
  ],
  EXECUTIVE_CLAIMS_SUB_MENU: [
    { name: 'Claims List', icon: '', link: 'claims-list' },
  ],
  EXECUTIVE_HOSPITALS_SUB_MENU: [
    { name: 'Network Hospitals', icon: '', link: 'network-hospitals' },
  ],
  EXECUTIVE_SERVICES_SUB_MENU: [
    { name: 'Issues List', icon: '', link: 'issues-list' },
    { name: 'Enquiry List', icon: '', link: 'callback-enquiry-list' },
  ],
  HR_MENU_LIST: [
    {
      name: 'employees',
      icon: 'list-alt',
      link: 'hr-home',
    },
    {
      name: 'Hospitals',
      icon: 'hospital',
      link: 'hr-home/hospitals',
    },
    { name: 'Claims', icon: 'notes-medical', link: 'hr-home/claims' },
    { name: 'Policies', icon: 'list-alt', link: 'hr-home/policies' },
  ],
  HR_EMPLOYEES_SUB_MENU: [
    { name: 'Pending Actions', icon: '', link: 'pending-actions' },
    { name: 'List Employees', icon: '', link: 'list-employees' },
    { name: 'Add Employee', icon: '', link: 'add-employee' },
    { name: 'Add Dependent', icon: '', link: 'add-dependent' },
    {
      name: 'Bulk Upload Employee',
      icon: '',
      link: 'bulk-upload-employee',
    },
    {
      name: 'Bulk Upload Dependents',
      icon: '',
      link: 'bulk-upload-dependents',
    },
  ],
  HR_CLAIMS_SUB_MENU: [
    { name: 'Claim Status', icon: '', link: 'claim-status' },
  ],
  HR_HOSPITALS_SUB_MENU: [
    { name: 'Network Hospitals', icon: '', link: 'network-hospitals' },
  ],
  HR_POLICIES_SUB_MENU: [
    { name: 'Policy Details', icon: '', link: 'policy-details' },
    // { name: 'Policy eCards', icon: '', link: 'policy-ecards' },
  ],
  CUST_MENU_LIST: [
    {
      name: 'Policies',
      icon: 'list-alt',
      link: 'customer-home',
    },
    {
      name: 'Hospitals',
      icon: 'hospital',
      link: 'customer-home/hospitals',
    },
    { name: 'Claims', icon: 'notes-medical', link: 'customer-home/claims' },
    { name: 'Services', icon: 'cogs', link: 'customer-home/services' },
  ],
  CUST_POLICIES_SUB_MENU: [
    { name: 'Policy Details', icon: '', link: 'policy-details' },
    { name: 'Policy e-Cards', icon: '', link: 'policy-ecards' },
    { name: 'Add Dependencies', icon: '', link: 'add-dependencies' },
    { name: 'View Members', icon: '', link: 'view-members' },
  ],
  CUST_HOSPITALS_SUB_MENU: [
    {
      name: 'Network Hospitals',
      icon: '',
      link: 'network-hospitals',
    },
  ],
  CUST_CLAIMS_SUB_MENU: [
    { name: 'Claim Status', icon: '', link: 'claim-status' },
    // { name: 'Intiate Claim', icon: '', link: 'intiate-claim' },
  ],
  CUST_SERVICES_SUB_MENU: [
    { name: 'Issues List', icon: '', link: 'issues-list' },
    // { name: 'Report Issue', icon: '', link: 'report-issue' },
    { name: 'Insurance Enquiry', icon: '', link: 'insurance-enquiry' },
    { name: 'Contact Details', icon: '', link: 'contact-details' },
  ],

  SERACH: 'search',
  NAME: 'name',
  PINCODE: 'pincode',
  HOSPITAL_NAME: 'hospitalName',
  CITY: 'city',
  DEPENDENTS: 'dependents',
  CORPORATES: 'corporates',
  NORECORDS: 'No records found',
  CORPORATEUUID: 'corporateUuid',

  ADDITION_STATUS: [
    'created',
    'hr approved',
    'pending insurer approval',
    'insurer approved',
    'pending tpa approval',
    'tpa approved',
    'active',
    'resigned',
  ],

  DELETION_STATUS: [
    'resigned',
    'hr approved',
    'pending insurer approval',
    'insurer approved',
    'pending tpa approval',
    'tpa approved',
  ],
  FAMILY_DEFINITION: [
    'Self',
    'Self + spouse',
    'Self + spouse + two children',
    'Self + spouse + two children + two parents',
    'Parents',
  ],

  YES_NO: ['Yes', 'No'],
  INSURANCE_COMPANIES: ['Religare', 'star health', 'HDFC ergo'],
  TPA_LIST: ['FHPL', 'MEDI Assist'],
  EMPLOYEE_ISSUE_TYPES: [
    'claims',
    'ecard',
    'dependents',
    'policy',
    'hospitals',
    'application',
  ],
  INSURANCE_TYPE: ['motor', 'life', 'health', 'travel', 'home'],

  EMPOYEE_TYPE: ['Employee', 'Dependant'],
  GENDER_TYPE: [
    {
      value: 'Male',
      label: 'Male',
    },
    {
      value: 'Female',
      label: 'Female',
    },
  ],

  Issue_TYPE: [
    {
      value: 'Pending',
      label: 'Pending',
    },
    {
      value: 'Resolved',
      label: 'Resolved',
    },
  ],

  EMPLOYEE_RELATION: [
    {
      value: 'Father',
      label: 'Father',
    },
    {
      value: 'Mother',
      label: 'Mother',
    },
    {
      value: 'Spouse',
      label: 'Spouse',
    },
    {
      value: 'Son',
      label: 'Son',
    },
    {
      value: 'Daughter',
      label: 'Daughter',
    },
  ],

  LOGIN_ROLE_DATA: [
    {
      value: 'HR',
      label: 'HR',
    },
    {
      value: 'Executive',
      label: 'Executive',
    },
    {
      value: 'Customer',
      label: 'Customer',
    },
  ],

  URL: {
    login: `${BASE_URL}/users/login`,
    get_pending_action_notifications: `${BASE_URL}/notifications/pendingActions`,
    cust_policyDetails: `${BASE_URL}/policies/`,
    cust_networkHospitals: `${BASE_URL}/networkHospitals`,
    cust_claimStatus: `${BASE_URL}/claims?empid=`,
    cust_policyEcard: `${BASE_URL}/policies/ecard`,
    cust_viewMembers: `${BASE_URL}/customers`,
    cust_customers: `${BASE_URL}/customers`,

    exe_getCorporates: `${BASE_URL}/corporates`,
    exe_createCustomers: `${BASE_URL}/customers`,
    exe_getExecutives: `${BASE_URL}/executives`,
    exe_updateExecutive: `${BASE_URL}/corporates/update_executive`,
    exe_policiesList: `${BASE_URL}/policies`,
    exe_bulkDependents: `${BASE_URL}/customers/dependents/bulk-add`,
    exe_policyReport: `${BASE_URL}/dashboard/policy/analytics`,
    exe_claimsAnalyticsReport: `${BASE_URL}/dashboard/claim/analytics`,
    exe_getAllIssues: `${BASE_URL}/executives/issues_list`,
    exe_getAllCBReuest: `${BASE_URL}/executives/callback_enquiry_list`,
    exe_resolveIssue: `${BASE_URL}/executives/resolve_issue`,
    exe_resolveCallback: `${BASE_URL}/executives/resolve_callback`,

    hr_claimStatus: `${BASE_URL}/claims`,
    hr_policyDetails: `${BASE_URL}/policies`,
    hr_bulkStatusCustomer: `${BASE_URL}/customers/bulk-status?corporateUuid=`,
    hr_bulkStatusDependent: `${BASE_URL}/customers/dependents/bulk-status?corporateUuid=`,

    insurance_companies: `${BASE_URL}/insuranceCompanies`,
    tpas_list: `${BASE_URL}/tpas`,
  },
};
