// Single word convert first letter Capital
export const CapitalizeFirstLetter = (str) => {
  if (typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Multiple words convert first letter Capital of each word
export const CapitalizeFirstLetterEveryWord = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .split(' ')
    .map((word) => CapitalizeFirstLetter(word))
    .join(' ');
};

// Remove duplicate object from array
export const removeDuplicatesArray = (array) => {
  array.splice(0, array.length, ...new Set(array));
};

// Printing console.logs in development mode
export const loggerMessage = (string, messages) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(string, messages);
  }
};

// Convert camelCase JSON key names to Sentense case text
export const camelCaseToSentenseText = (inputText) => {
  if (typeof inputText === 'string' || inputText instanceof String) {
    inputText = inputText.charAt(0).toUpperCase() + inputText.slice(1);
    inputText = inputText.replace('TPA', 'TPA ');
    return inputText
      .split(/([A-Z][a-z]+)/)
      .filter(function (e) {
        return e;
      })
      .join(' ');
  }
};
// Convert Underscore in a string with a Space in JavaScript
export const underscoreToSpaceText = (inputText) => {
  if (typeof inputText === 'string' || inputText instanceof String) {
    let returnTxt = inputText.replace(/_/g, ' ');
    return returnTxt.charAt(0).toUpperCase() + returnTxt.slice(1);
  }
};

// Left menu active state class
export const stringCheckLocationHref = (leftMainMenu) => {
  if (typeof leftMainMenu === 'string' || leftMainMenu instanceof String) {
    // return window.location.href.indexOf(leftMainMenu) > -1;
    return window.location.href.split('/').includes(leftMainMenu);
  }
};

// Remove duplicate object from Corporate array
export const uniqueCorporateObject = (array) => {
  let modifiedData = array.map((x) => x);
  return [
    ...new Map(modifiedData.map((item) => [item.displayName, item])).values(),
  ];
};

// Checking Email Format
export const isValidEmail = (email) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Checking Valid Date
export const isValidDate = (date) => {
  console.log('date isValidDate ', date);
  return new Date(date).toString() !== 'Invalid Date';
};

// Checking Indian Mobile number format
export const isValidMobile = (mobile) => {
  let re = new RegExp(/^[6-9]\d{9}$/);
  return re.test(mobile);
};

//  For Left Nav Main Menu Heading Click Event
export const mainLeftNavHead = (e) => {
  e.preventDefault();
  if (!!e.currentTarget.parentNode.classList.contains('mm-active')) {
    e.currentTarget.parentNode.classList.remove('mm-active');
  } else {
    const mainMenuList = document.querySelectorAll('.main-menu-list');
    mainMenuList.forEach((item) => {
      if (item.classList.contains('mm-active')) {
        item.classList.remove('mm-active');
      }
    });
    e.currentTarget.parentNode.classList.add('mm-active');
  }
};

//  For Left Nav Sub Menu Heading Click Event
export const subLeftNavHead = (e) => {
  if (!!e.currentTarget.classList.contains('hpr-sub-menu-active')) {
    return;
  }
  const subMenuList = document.querySelectorAll('.sub-menu-list-link');
  subMenuList.forEach((item) => {
    if (item.classList.contains('hpr-sub-menu-active')) {
      item.classList.remove('hpr-sub-menu-active');
    }
  });
  e.currentTarget.classList.add('hpr-sub-menu-active');
};

// Aceept format for Bulk upload CSV/XL ..
export const sheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'xml',
  'csv',
  'txt',
  'ods',
  'fods',
  'uos',
  'sylk',
  'dif',
  'dbf',
  'prn',
  'qpw',
  '123',
  'wb*',
  'wq*',
  'html',
  'htm',
]
  .map(function (x) {
    return '.' + x;
  })
  .join(',');

//  State Array of Objects
export const stateArray = [
  { code: 'AN', name: 'Andaman and Nicobar Islands' },
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'AR', name: 'Arunachal Pradesh' },
  { code: 'AS', name: 'Assam' },
  { code: 'BR', name: 'Bihar' },
  { code: 'CG', name: 'Chandigarh' },
  { code: 'CH', name: 'Chhattisgarh' },
  { code: 'DH', name: 'Dadra and Nagar Haveli' },
  { code: 'DD', name: 'Daman and Diu' },
  { code: 'DL', name: 'Delhi' },
  { code: 'GA', name: 'Goa' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'HR', name: 'Haryana' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'JK', name: 'Jammu and Kashmir' },
  { code: 'JH', name: 'Jharkhand' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'KL', name: 'Kerala' },
  { code: 'LD', name: 'Lakshadweep' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'MN', name: 'Manipur' },
  { code: 'ML', name: 'Meghalaya' },
  { code: 'MZ', name: 'Mizoram' },
  { code: 'NL', name: 'Nagaland' },
  { code: 'OR', name: 'Odisha' },
  { code: 'PY', name: 'Puducherry' },
  { code: 'PB', name: 'Punjab' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'SK', name: 'Sikkim' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'TS', name: 'Telangana' },
  { code: 'TR', name: 'Tripura' },
  { code: 'UK', name: 'Uttarakhand' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'WB', name: 'West Bengal' },
];

//  Employee status
export const _employeeStatus = [
  'all',
  'created',
  'hr approved',
  'pending insurer approval',
  'insurer approved',
  'pending tpa approval',
  'tpa approved',
  'active',
  'resigned',
  'rejected',
  'inactive',
];
//  Employee Approve type
export const _approvalType = ['addition', 'deletion'];
