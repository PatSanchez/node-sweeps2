var express = require('express');
var router = express.Router();
var headers = require('../utils/headers');
var rest = require('rest');
var mime = require('rest/interceptor/mime');
var findEnumNameWhereId = require('../utils/enums');

var client = rest.wrap(mime);

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/:guid', function(req, res) {
  client( {path: 'https://api.secondstreetapp.com/promotion_contents?organizationPromotionUniqueId=' + req.params.guid, headers: headers})
    .then(function(response) {
      if (response.status.code === 200) {
        const pc = response.entity.promotion_contents[0];
        headers['X-Organization-Id'] = pc.organization_id;
        headers['X-Organization-Promotion-Id'] = pc.organization_promotion_id;
        headers['X-Promotion-Id'] = pc.promotion_id;
        return client( {path: 'https://api.secondstreetapp.com/forms?sideloadSubObjects=false', headers: headers});
      }
      else {
        throw new Error('Promotion not found')
      }
    })
    .then(function(response) {
      var forms = response.entity.forms;
      forms.forEach(function(form){
        form.form_field_groups.forEach(function(ffg) {
          ffg.form_fields.forEach(function(ff) {
            if(!ff.label_text) {
              ff.label_text = ff.fields.name;
            }
            var fieldTypeName = findEnumNameWhereId('FIELD_TYPE', ff.fields.field_type_id);
            ff.fields['is' + fieldTypeName] = true;
          });
        });
      });
      var registrationForm = forms.filter(function(form){ return form.form_type_id === 1})[0];
      var entryForm = forms.filter(function(form){ return form.form_type_id === 2})[0];
      res.render('enter', { registration_form: registrationForm, entry_form: entryForm });
    })
    .catch(function(error) {
      res.render('error', { message: 'Not Found', error: error });
    })
  ;

});

module.exports = router;
