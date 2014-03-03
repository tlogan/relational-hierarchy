dragoman.state = function() {

  var hosts = _.reduce([
    ['gmail','gmail.com'],
    ['yahoo', 'yahoo.com'],
    ['facebook', 'facebook.com'],
    ['orbitz', 'orbitz.com'],
    ['phone', 'phone']
  ], function (result, item) {
    result[item[0]] = dragoman.host(item[1]);
    return result;
  }, {});

  var accounts = _.reduce([
      ['erika_gmail', 'erika', hosts.gmail],
      ['thomas_gmail', 'thomas', hosts.gmail],
      ['siiri_facebook', 'siiri', hosts.facebook],
      ['erika_facebook', 'erika', hosts.facebook],
      ['jason_yahoo', 'jason', hosts.yahoo],
      ['kathy_yahoo', 'kathy', hosts.yahoo],
      ['info_orbitz', 'info', hosts.orbitz],
      ['_123_phone', '123', hosts.phone],
      ['_456_phone', '456', hosts.phone]
  ], function (result, item) {
    result[item[0]] = dragoman.account(item[1], item[2]);
    return result;
  }, {});

  var protocols = _.reduce([
    'smtp',
    'xmpp',
    'sip',
    'sms',
    'voice' 
  ], function (result, item) {
    result[item] = dragoman.protocol(item);
    return result;
  }, {});
  
  var account_protocols = _.reduce([
      ['erika_gmail_smtp', accounts.erika_gmail, protocols.smtp],
      ['erika_gmail_xmpp', accounts.erika_gmail, protocols.xmpp],
      ['_123_phone_sms', accounts._123_phone, protocols.sms],
      ['thomas_gmail_xmpp', accounts.thomas_gmail, protocols.xmpp],
      ['siiri_facebook_xmpp', accounts.siiri_facebook, protocols.xmpp],
      ['siiri_facebook_smtp', accounts.siiri_facebook, protocols.smtp],
      ['siiri_facebook_sip', accounts.siiri_facebook, protocols.sip],
      ['_456_phone_sms', accounts._456_phone, protocols.sms],

      ['jason_yahoo_xmpp', accounts.jason_yahoo, protocols.xmpp],
      ['kathy_yahoo_xmpp', accounts.kathy_yahoo, protocols.xmpp],
      ['info_orbitz_smtp', accounts.info_orbitz, protocols.smtp]
  ], function (result, item) {
    result[item[0]] = dragoman.account_protocol(item[1], item[2]);
    return result;
  }, {});

  var aps = account_protocols;
  var xmpp_send_subscriptions = _.reduce([
      ['erika_siiri', aps.erika_gmail_xmpp, aps.siiri_facebook_xmpp],
      ['siir_erika', aps.siiri_facebook_xmpp, aps.erika_gmail_xmpp],
      ['erika_thomas', aps.erika_gmail_xmpp, aps.thomas_gmail_xmpp],
      ['thomas_erika', aps.thomas_gmail_xmpp, aps.erika_gmail_xmpp],

      //erika can send messages to jason
      ['erika_jason', aps.erika_gmail_xmpp, aps.jason_yahoo_xmpp],

      //erika can be sent messages from kathy
      ['kathy_erika', aps.kathy_yahoo_xmpp, aps.erika_gmail_xmpp]
  ], function (result, item) {
    result[item[0]] = dragoman.subscription(item[1], item[2]);
    return result;
  }, {});

  var contacts = _.reduce([
    ['erika', 'Erika'],
    ['siiri', 'Siiri'],
    ['thomas', 'Thomas']
  ], function (result, item) {
    result[item[0]] = dragoman.contact(item[1]);
    return result;
  }, {});

  var account_protocol_contacts = _.reduce([
    ['erika_gmail_smtp_erika', aps.erika_gmail_smtp, contacts.erika],
    ['erika_gmail_xmpp_erika', aps.erika_gmail_xmpp, contacts.erika],
    ['_123_phone_sms_erika', aps.erika_phone_sms, contacts.erika],
    ['siiri_facebook_smtp_siiri', aps.siiri_facebook_smtp, contacts.siiri],
    ['siiri_facebook_xmpp_siiri', aps.siiri_facebook_xmpp, contacts.siiri],
    ['_456_phone_sms_siiri', aps._456_phone_sms, contacts.siiri],
    ['thomas_gmail_xmpp_thomas', aps.thomas_gmail_xmpp, contacts.thomas]
  ], function (result, item) {
    result[item[0]] = dragoman.account_protocol_contact(item[1], item[2]);
    return result;
  }, {});

  var messages = _.reduce([
    ['m1', aps.erika_gmail_smtp, aps.siiri_facebook_smtp, 1, true, 'Hey Pookey!'],
    ['m2', aps.siiri_facebook_smtp, aps.erika_gmail_smtp, 2, true, "What's up girl?!!"],
    ['m3', aps.thomas_gmail_xmpp, aps.erika_gmail_xmpp, 3, true, "Hey can you buy me some more girl scout cookies?"],
    ['m4', aps.siiri_facebook_xmpp, aps.erika_gmail_xmpp, 4, true, "P.S. you should come to Israel"],
    ['m5', aps.info_orbitz_smtp, aps.erika_gmail_smtp, 5, true, "Your flight information below:"],
    ['m6', aps.erika_gmail_xmpp, aps.thomas_gmail_xmpp, 6, true, "I think you should eat more fruit instead"],
    ['m7', aps.erika_gmail_xmpp, aps.jason_yahoo_xmpp, 7, true, "You are such a dick, we are no longer friends."], 
    ['m8', aps.erika_gmail_xmpp, aps.siiri_facebook_xmpp, 8, true, "OK! booking my flight now!"],
    ['m9', aps.kathy_yahoo_xmpp, aps.erika_gmail_xmpp, 9, false, "Hey Erika, thanks for letting me copy your lecture notes :)"],
    ['m10', aps._456_phone_sms, aps._123_phone_sms, 10, false, "Wait, you're actually coming?"]
  ], function (result, item) {
    result[item[0]] = dragoman.message(item[1], item[2], item[3], item[4], item[5]);
    return result;
  }, {});


  var attr_value_qwords = function() {

    var addresses = function() {
      return _.reduce(accounts, function(result, account, id) {
        result[id] = dragoman.qword(id, account.name + '@' + account.host.name);
        return result;
      }, {});
    };

    return _.reduce([
      ['sender_name', 'Sender Name', function() {
        return _.reduce(contacts, function(result, contact, id) {
          result[id] = dragoman.qword(id, contact.name);
          return result;
        }, {});
      }],
      ['sender_address', 'Sender Address', addresses],
      ['receiver_address', 'Receiver Address', addresses],
      ['read', 'Read', function() {
        return {
          yes: dragoman.qword('yes', 'yes'),
          no: dragoman.qword('no', 'no')
        };
      }]
    ], function (result, item) {

      var attr_qword = dragoman.qword(item[0], item[1]);
      var value_qwords = item[2]; 

      result[attr_qword.id] = dragoman.attr_qword_value_qwords(attr_qword, value_qwords);
      return result;

    }, {});

  }();


  var open_attr_qwords = _.reduce([
    ['body', 'Body']
  ], function (result, item) {
    result[item[0]] = dragoman.qword(item[0], item[1]);
    return result;
  }, {});

  var conj_qwords = _.reduce([
    ['intersection', 'x'],
    ['union', '+'],
    ['nest', '/'],
    ['done', '']
  ], function (result, item) {
    result[item[0]] = dragoman.qword(item[0], item[1]);
    return result;
  }, {});

  var closed_attr_qwords = _.map(attr_value_qwords, function(av) {
    return av.attr_qword;
  });

  var query_types = _.reduce([
    ['groups', function(position, prev_qword) {
      if (position == 0) {
        return  _.union([conj_qwords.done], closed_attr_qwords);
      } else {
        var ss = [
          _.union([conj_qwords.done], closed_attr_qwords),
          [conj_qwords.done, conj_qwords.nest, conj_qwords.union, conj_qwords.intersection]
        ];
        return ss[position % 2];
      }
    }],
    ['filters', function(position, prev_qword) {

      if (position == 0) {
        return  _.union([conj_qwords.done], closed_attr_qwords);
      } else if (position % 3 == 0) {
        return closed_attr_qwords;
      } else if (position % 3 == 1) {
        return _.map(attr_value_qwords[prev_qword.id].value_qwords(), function(qword) {
          return qword;
        });
      } else {
        return [conj_qwords.done, conj_qwords.union, conj_qwords.intersection];
      }

    }],
    ['preview', function(position, prev_qword) {
      var ss = [
        _.union(open_attr_qwords, closed_attr_qwords),
        [conj_qwords.done, conj_qwords.union]
      ];

      return ss[position % 2];
    }]

  ], function (result, item) {
    result[item[0]] = dragoman.query_type(item[0], item[1]);
    return result;
  }, {});

  //////////////////

  var io_handlers = [];

  var notify_handlers = function(on_state_change, obj) {
    _.forEach(io_handlers, function(handler) {
      handler[on_state_change](obj);
    });
  };

  var new_org = dragoman.organization(
    'new',
    '',
    dragoman.query(
      dragoman.query_phrase(query_types.groups,[conj_qwords.done]), 
      dragoman.query_phrase(query_types.filters,[conj_qwords.done]), 
      dragoman.query_phrase(
        query_types.preview, 
        [open_attr_qwords.body, conj_qwords.done] 
      )
    )
  );


  var organizations = {};

  var foc_org = null;
  var set_foc_org = function(_foc_org) {
    foc_org = _foc_org;
    notify_handlers('on_foc_org_change', foc_org);
  };

  var edit_org = null;
  var set_edit_org = function(_edit_org) {
    edit_org = _edit_org;
    notify_handlers('on_edit_org_change', edit_org);
  };

  var qword_selection = null;
  var set_qword_selection = function(_qword_selection) {
    qword_selection = _qword_selection;
    notify_handlers('on_qword_selection_change', qword_selection);
  };

  //interface
  var subscribe = function(io_handler) {
    io_handler.on_foc_org_change(foc_org),
    io_handler.on_edit_org_change(edit_org),
    io_handler.on_new_org_change(new_org)
    io_handler.on_qword_selection_change(new_org)

    io_handlers.push(io_handler);
  };

  var create_new_organization = function() {
    set_foc_org(new_org);
    set_edit_org(new_org);
  };

  var change_qword_selection = function(position, query_type) {

    if (edit_org == null) {
      alert('error: edit_org is null in change_qword_selection');
    }

    var qwords = edit_org.query[query_type].selection(position);
    set_qword_selection(dragoman.qword_selection(position, query_type, qwords)); 

  };

  var replace_qword = function(qword, position, query_type_id) {

    var query_phrase = edit_org.query[query_type_id];
    var old_qwords = query_phrase.qwords;
    if (qword != old_qwords[position]) {

      var query_type = query_types[query_type_id]; 

      var start = old_qwords.slice(0, position);
      var length = old_qwords.length;
      var new_qwords = function() {
        if (qword == conj_qwords.done) {
          return _.union(start, qword);
        } else {
          var next_word = query_type.selection(position + 1, qword)[0];
          if (next_word != conj_qwords.done) {
            return _.union(start, qword, next_word, conj_qwords.done);
          } else {
            return _.union(start, qword, next_word);
          }
        }
      }();



      var new_query = dragoman.query(
        edit_org.query.groups, 
        edit_org.query.filters, 
        edit_org.query.preview 
      );
      new_query[query_type_id] = dragoman.query_phrase(query_type, new_qwords);

      var org = dragoman.organization(
        edit_org.id,
        edit_org.name,
        new_query
      );

      set_edit_org(org);


    }

    set_qword_selection(null); 

  };

  return {
    subscribe: subscribe,
    create_new_organization: create_new_organization,
    change_qword_selection: change_qword_selection,
    replace_qword: replace_qword
  };

}();
