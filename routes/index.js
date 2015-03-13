var express = require('express');
var router = express.Router();
var headers = require('../utils/headers');
var rest = require('rest');
var mime = require('rest/interceptor/mime');
var findEnumNameWhereId = require('../utils/enums');

var client = rest.wrap(mime);

//TODO: Make work.
function findCurrentMatchup(matchups) {
  return matchups[0];
}

router.get('/sweeps/:guid', function(req, res) {
  var currentMatchupId, newHeaders;
  client( {path: 'https://api.secondstreetapp.com/promotion_contents?organizationPromotionUniqueId=' + req.params.guid, headers: headers})
    .then(function(response) {
      if (response.status.code === 200) {
        const pc = response.entity.promotion_contents[0];
        newHeaders = JSON.parse(JSON.stringify(headers));
        newHeaders['X-Organization-Id'] = pc.organization_id;
        newHeaders['X-Organization-Promotion-Id'] = pc.organization_promotion_id;
        newHeaders['X-Promotion-Id'] = pc.promotion_id;
        return client( {path: 'https://api.secondstreetapp.com/matchups', headers: newHeaders});
      }
      else {
        throw new Error('Promotion not found')
      }
    })
    //TODO: This doesn't need to run before forms. Should find out if this library supports eq to RSVP.all
    .then(function(response) {
      var matchups = response.entity.matchups;
      currentMatchupId = findCurrentMatchup(matchups).id;
      return client( {path: 'https://api.secondstreetapp.com/forms?sideloadSubObjects=false', headers: newHeaders});
    })
    .then(function(response) {
      var forms = response.entity.forms;
      forms.forEach(function(form){
        form.expected_fields = [];
        form.form_field_groups.sort(function(a, b) {
          return a.display_order > b.display_order;
        });
        form.form_field_groups.forEach(function(ffg) {
          ffg.form_fields.sort(function(a, b) {
            return a.display_order > b.display_order;
          });
          ffg.form_fields.forEach(function(ff) {

            //Sometimes form fields don't have labels so use the field name instead
            if(!ff.label_text) {
              ff.label_text = ff.fields.name;
            }
            var fieldTypeName = findEnumNameWhereId('FIELD_TYPE', ff.fields.field_type_id);
            ff.fields['is' + fieldTypeName] = true;
            form.expected_fields.push(
              {
                id: ff.fields.id,
                type: fieldTypeName
              }
            );
            if(ff.fields.field_options) {
              ff.fields.field_options.sort(function(a, b) {
                return a.display_order > b.display_order;
              });
            }
          });
        });
        form.expected_fields = JSON.stringify(form.expected_fields);
      });
      var registrationForm = forms.filter(function(form){ return form.form_type_id === 1})[0];
      var entryForm = forms.filter(function(form){ return form.form_type_id === 2})[0];
      res.render('enter', {
        registration_form: registrationForm,
        entry_form: entryForm,
        guid: req.params.guid,
        current_matchup_id: currentMatchupId,
        organization_id: newHeaders['X-Organization-Id'],
        organization_promotion_id: newHeaders['X-Organization-Promotion-Id'],
        promotion_id: newHeaders['X-Promotion-Id']
      });
    })
    .catch(function(error) {
      res.render('error', { message: 'Not Found', error: error });
    })
  ;

});

router.post('/form_submission', function(req, res) {
  console.log(req.body);
  var entryFormId = req.body.entry_form_id;
  var entryFields = JSON.parse(req.body['form_' + entryFormId]);
  var entryFormSubmission = {
    form_submissions: [
      {
        referrer: null,
        fields: entryFields.map(function(field) {
          return {
            id: field.id,
            field_value: req.body[field.id]
          }
        }),
        matchup_id: req.body.current_matchup_id,
        form_id: entryFormId
      }
    ]
  };
  var newHeaders = JSON.parse(JSON.stringify(headers));
  newHeaders['X-Organization-Id'] = req.body.organization_id;
  newHeaders['X-Organization-Promotion-Id'] = req.body.organization_promotion_id;
  newHeaders['X-Promotion-Id'] = req.body.promotion_id;
  client( {path: 'https://api.secondstreetapp.com/form_submissions', method: 'POST', headers: newHeaders, entity: entryFormSubmission})
    .then(function(response) {
      console.log(response.entity.server_errors);
      res.redirect('/sweeps/' + req.query.guid + '/thanks')
    });

});

router.get('/sweeps/:guid/thanks', function(req, res) {
  res.render('thanks');
});

module.exports = router;
