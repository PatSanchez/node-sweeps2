var ENUMS = {
  FIELD_TYPE: [
    {
      id: 1,
      name: 'SelectSingle',
      defaultFieldOptionTypeId: 1
    },
    {
      id: 2,
      name: 'RadioButtons',
      defaultFieldOptionTypeId: 1
    },
    {
      id: 3,
      name: 'Textbox',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 4,
      name: 'Textarea',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 5,
      name: 'SelectMultiple',
      defaultFieldOptionTypeId: 1
    },
    {
      id: 6,
      name: 'Checkboxes',
      defaultFieldOptionTypeId: 1
    },
    {
      id: 7,
      name: 'CustomDateInput',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 8,
      name: 'DisplayText',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 9,
      name: 'DisplayNumber',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 10,
      name: 'DisplayMoney',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 11,
      name: 'DisplayDate',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 12,
      name: 'DisplayBoolean',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 13,
      name: 'ImageSelect',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 14,
      name: 'VideoSelect',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 15,
      name: 'FileSelect',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 16,
      name: 'DynamicTextboxes',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 17,
      name: 'GroupedFields',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 18,
      name: 'Password',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 19,
      name: 'FacebookLikeApi',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 20,
      name: 'TwitterFollowApi',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 21,
      name: 'SingleCheckbox',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 22,
      name: 'NumberInput',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 23,
      name: 'EmailTextbox',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 24,
      name: 'Codeword',
      defaultFieldOptionTypeId: 0
    },
    {
      id: 26,
      name: 'TwitterTweetApi',
      defaultFieldOptionTypeId: 0
    }
  ]
};

var findEnumNameWhereId = function(enumName, id) {
  var name, arr, found;
  name = null;
  arr = ENUMS[enumName];
  if (arr) {
    found = arr.filter(function(item) {
      return item.id === id;
    });
    if(found) {
      name = found[0].name;
    }
  }
  return name;
};

module.exports = findEnumNameWhereId;