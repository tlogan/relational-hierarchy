var dragoman = {};

dragoman.host = function(name) { return {
      name: name
};};

dragoman.account = function(name, host) { return {
    name: name,
    host: host
};};

dragoman.protocol = function(name) { return {
    name: name
};};

dragoman.contact = function(name) { return {
    name: name
};};

dragoman.account_protocol = function(account, protocol) { return {
    account: account, 
    protocol: protocol,
};};

dragoman.subscription = function(subscriber, subscribee) { return {
    subscriber: subscriber, 
    subscribee: subscribee 
};};

dragoman.account_protocol_contact = function(account_protocol, contact) { return {
    account_protocol: account_protocol,
    contact: contact
};};

dragoman.contact = function(name) { return {
    name: name
};};

dragoman.message = function(protocol, sender, receiver, time, read, subject, body) { return {
  protocol: protocol,
  sender: sender,
  receiver: receiver,
  time: time,
  read: read,
  subject: subject,
  body: body 
};};

dragoman.organization = function(name, query) { return {
  name: name,
  query: query 
};};

dragoman.qword = function(name) { return {
  name: name  
};};

dragoman.attr_value_pair = function(attr_qword, value_qword) { 
  
  var messages = function() {
    return attr_qword.messages(value_qword.source); 
  }; 

  return {
    attr_qword: attr_qword,
    value_qword: value_qword,
    messages: messages
  };
};

dragoman.dir = function(pairs, parent) { 

  var level = 
    (parent == null) ? 0
    : parent.level + 1;

  var all_pairs = 
    (parent == null) ? pairs
    : _.flatten([pairs, parent.all_pairs]);
  
  return {
    file_type: dragoman.file_types.dir,
    pairs: pairs,
    parent: parent,
    children: null,
    level: level,
    all_pairs: all_pairs
  };
};

dragoman.leaf = function(preview_qwords, user, message) { 

  var obj = {};
  obj.pairs = _.map(preview_qwords, function(qword) {
    return dragoman.attr_value_pair(qword, qword.value(message));
  });

  obj.is_sender_user = function() { return user.is_sender_of(message); };
  obj.file_type = dragoman.file_types.leaf;
  obj.message = message;

  return obj;
};


/*
 * value: function(dragoman.message()): dragoman.value_qword() 
 * values: function(): [dragoman.value_qword()] 
 * messages: function(dragoman.value.qword()): [dragoman.message()]
 */
dragoman.attr_qword = function(name, open, value, value_qwords, messages) { 

  var a = dragoman.qword(name); 
  a.open = open;
  a.value = value;
  a.value_qwords = value_qwords;
  a.messages = messages;
  return a;
  
};

dragoman.value_qword = function(name, source) { 
  var v = dragoman.qword(name); 
  v.source = source 
  return v;
};

dragoman.org_data = function(org, data, options) { return {
  org: org,
  data: data, 
  options: options
};};

dragoman.qword_selection = function(position, query_phrase_type, qwords) { return {
    position: position,
    query_phrase_type: query_phrase_type, 
    qwords: qwords 
};};

//takes a query phrase of each type
dragoman.query = function(groups_phrase, filters_phrase, preview_phrase) { return {
  groups: groups_phrase,
  filters: filters_phrase,
  preview: preview_phrase
};};

//selection is a function
dragoman.query_phrase_type = function(name, selection) { return {
  name: name,
  selection: selection
};};

dragoman.query_phrase = function(query_phrase_type, qwords) { 

  var selection = function(position) {
    var prev_qwords = qwords.slice(0, position);
    return query_phrase_type.selection(position, prev_qwords);
  };
  
  return {
    query_phrase_type: query_phrase_type,
    qwords: qwords,  
    selection: selection
  };

};

dragoman.file_types = {
  dir: 1, 
  leaf: 2, 
};

dragoman.database = function() {

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

  var user = function() {

    var contact = contacts.erika; 
    var account_protocols = function() {
      return _.map(_.filter(account_protocol_contacts, function(apc) {
        return apc.contact == contact;
      }), function(apc) {
        return apc.account_protocol;
      });
    };

    var is_sender_of = function(message) {
      return _.reduce(account_protocols(), function(result, ap) {
        return result || (message.protocol == ap.protocol && message.sender == ap.account); 
      }, false);
    };

    var is_receiver_of = function(message) {
      return _.reduce(account_protocols(), function(result, ap) {
        return result || (message.protocol == ap.protocol && message.receiver == ap.account); 
      }, false);
    };

    return {
      contact: contact,
      account_protocols: account_protocols,
      is_sender_of: is_sender_of,
      is_receiver_of: is_receiver_of
    };

  }();

  var account_protocol_contacts = _.reduce([
    ['erika_gmail_smtp_erika', aps.erika_gmail_smtp, contacts.erika],
    ['erika_gmail_xmpp_erika', aps.erika_gmail_xmpp, contacts.erika],
    ['_123_phone_sms_erika', aps._123_phone_sms, contacts.erika],
    ['siiri_facebook_smtp_siiri', aps.siiri_facebook_smtp, contacts.siiri],
    ['siiri_facebook_xmpp_siiri', aps.siiri_facebook_xmpp, contacts.siiri],
    ['_456_phone_sms_siiri', aps._456_phone_sms, contacts.siiri],
    ['thomas_gmail_xmpp_thomas', aps.thomas_gmail_xmpp, contacts.thomas]
  ], function (result, item) {
    result[item[0]] = dragoman.account_protocol_contact(item[1], item[2]);
    return result;
  }, {});

  var yesnos = {
    yes: {name: 'yes'},
    no: {name: 'no'}
  };

  var messages = _.reduce([
    ['m1', protocols.smtp, accounts.erika_gmail, accounts.siiri_facebook, 1, yesnos.yes, 'greetings', 'Hey Pookey!'],
    ['m2', protocols.smtp, accounts.siiri_facebook, accounts.erika_gmail, 2, yesnos.yes, 'RE: greetings', "What's up girl?!!"],
    ['m3', protocols.xmpp, accounts.thomas_gmail, accounts.erika_gmail, 3, yesnos.yes, '', "Hey can you buy me some more girl scout cookies?"],
    ['m4', protocols.xmpp, accounts.siiri_facebook, accounts.erika_gmail, 4, yesnos.yes, 'RE: greetings', "P.S. you should come to Israel"],
    ['m5', protocols.smtp, accounts.info_orbitz, accounts.erika_gmail, 5, yesnos.yes, 'Orbitz Flight', "Your flight information below:"],
    ['m6', protocols.xmpp, accounts.erika_gmail, accounts.thomas_gmail, 6, yesnos.yes, '', "I think you should eat more fruit instead"],
    ['m7', protocols.xmpp, accounts.erika_gmail, accounts.jason_yahoo, 7, yesnos.yes, '', "We are no longer friends."], 
    ['m8', protocols.xmpp, accounts.erika_gmail, accounts.siiri_facebook, 8, yesnos.yes, '', "OK! booking my flight now!"],
    ['m9', protocols.xmpp, accounts.kathy_yahoo, accounts.erika_gmail, 9, yesnos.no, '', "Hey Erika, thanks for letting me copy your lecture notes :)"],
    ['m10', protocols.sms, accounts._456_phone, accounts._123_phone, 10, yesnos.no, '', "Wait, you're actually coming?"]
  ], function (result, item) {
    result[item[0]] = dragoman.message(item[1], item[2], item[3], item[4], item[5], item[6], item[7]);
    return result;
  }, {});

  var attr_qwords = function() {

    var account_values = function() {
      return _.map(accounts, function(account) {
        return dragoman.value_qword(account.name + '@' + account.host.name, account);
      });
    };

    return _.reduce([
      ['correspondent', 'Correspondent', false, function(message) {
        var corr_apcs = _.filter(account_protocol_contacts, function(apc) {
          if (user.is_sender_of(message)) {
            return apc.account_protocol.account == message.receiver
              && apc.account_protocol.protocol == message.protocol;
          } else {
            return apc.account_protocol.account == message.sender
              && apc.account_protocol.protocol == message.protocol;
          }
        });
        if (contact_apcs.length > 0) {
          var contact = contact_apcs[0].contact;
          return dragoman.value_qword(contact.name, contact);
        } else {
          var account =  user.is_sender_of(message)
            ? message.receiver : message.sender;
          var host = account.host;
          return dragoman.value_qword(account.name + '@' + host.name, null);
        }
      }, function() {
        return _.map(contacts, function(contact) {
          return dragoman.value_qword(contact.name, contact);
        });
      }, function(corr_contact) {
        var corr_aps = _.map(_.filter(account_protocol_contacts, function(apc) {
          return apc.contact == corr_contact;
        }), function(apc) {
          return apc.account_protocol;
        });

        if (corr_contact == user.contact) {
          return _.filter(messages, function(message) {
            return user.is_sender_of(message) && user.is_receiver_of(message);
          });
        } else {
          return _.filter(messages, function(message) {
            return _.reduce(corr_aps, function(result, ap) {
              return result || 
                ((message.sender == ap.account || message.receiver == ap.account) 
                && message.protocol == ap.protocol);
            }, false);
          });
        }

      }],
      ['sender', 'Sender', false, function(message) {
        var sender_apcs = _.filter(account_protocol_contacts, function(apc) {
          return apc.account_protocol.account == message.sender
            && apc.account_protocol.protocol == message.protocol;
        });
        if (sender_apcs.length > 0) {
          var contact = sender_apcs[0].contact;
          return dragoman.value_qword(contact.name, contact);
        } else {
          var account = message.sender;
          var host = account.host;
          return dragoman.value_qword(account.name + '@' + host.name, null);
        }
      }, function() {
        return _.map(contacts, function(contact) {
          return dragoman.value_qword(contact.name, contact);
        });
      }, function(sender_contact) {
        var contact_aps = _.map(_.filter(account_protocol_contacts, function(apc) {
          return apc.contact == sender_contact;
        }), function(apc) {
          return apc.account_protocol;
        });
        return _.filter(messages, function(message) {
          return _.reduce(contact_aps, function(result, ap) {
            return result || (message.sender == ap.account && message.protocol == ap.protocol);
          }, false);
        });
      }],
      ['receiver', 'Receiver', false, function(message) {
        var receiver_apcs = _.filter(account_protocol_contacts, function(apc) {
          return apc.account_protocol.account == message.receiver
            && apc.account_protocol.protocol == message.protocol;
        });
        if (receiver_apcs.length > 0) {
          var contact = receiver_apcs[0].contact;
          return dragoman.value_qword(contact.name, contact);
        } else {
          var account = message.receiver;
          var host = account.host;
          return dragoman.value_qword(account.name + '@' + host.name, null);
        }
      }, function() {
        return _.map(contacts, function(contact) {
          return dragoman.value_qword(contact.name, contact);
        });
      }, function(receiver_contact) {
        var contact_aps = _.map(_.filter(account_protocol_contacts, function(apc) {
          return apc.contact == receiver_contact;
        }), function(apc) {
          return apc.account_protocol;
        });
        return _.filter(messages, function(message) {
          return _.reduce(contact_aps, function(result, ap) {
            return result || (message.receiver == ap.account && message.protocol == ap.protocol);
          }, false);
        });
      }],
      ['protocol', 'Protocol', false, function(message) {
        var protocol = message.protocol;
        return dragoman.value_qword(protocol.name, protocol);
      }, function() {
        return _.map(protocols, function(protocol) {
          return dragoman.value_qword(protocol.name, protocol);
        });
      }, function(protocol) {
        return _.filter(messages, function(m) {
          return m.protocol == protocol;
        });
      }],
      ['sender_address', 'Sender Address', false, function(message) {
        var account = message.sender;
        var host = account.host;
        var string = account.name + '@' + host.name;
        return dragoman.value_qword(string, account);
      }, account_values, function(account) {
        return _.filter(messages, function(m) {
          return m.sender == account;
        });
      }],
      ['receiver_address', 'Receiver Address', false, function(message) {
        var account = message.receiver;
        var host = account.host;
        var string = account.name + '@' + host.name;
        return dragoman.value_qword(string, account);
      }, account_values, function(account) { 
        return _.filter(messages, function(m) {
          return m.receiver == account;
        });
      }],

      ['subject', 'Subject', true, function(message) {
        return dragoman.value_qword(message.subject, message.subject);
      }, function() { 
        return _.map(messages, function(message) {
          return dragoman.value_qword(message.subject, message.subjet);
        });
      }, function(subject) {
        return _.filter(messages, function(m) {
          return m.subject === subject;
        });
      }],

      ['body', 'Body', true, function(message) {
        return dragoman.value_qword(message.body, message.body);
      }, function() { 
        return _.map(messages, function(message) {
          return dragoman.value_qword(message.body, message.body);
        });
      }, function(body) {
        return _.filter(messages, function(m) {
          return m.body == body;
        });
      }],

      ['read', 'Read', false, function(message) {
        return dragoman.value_qword(message.read.name, message.read);
      }, function() { 
        return _.map(yesnos, function(yesno) {
          return dragoman.value_qword(yesno.name, yesno);
        });
      }, function(read) {
        return _.filter(messages, function(m) {
          return m.read == read;
        });
      }]
    ], function (result, item) {

      var attr_name = item[1];
      var open = item[2];
      var value = item[3];
      var values = item[4];
      var messages = item[5];
      var attribute = dragoman.attr_qword(attr_name, open, value, values, messages);

      result[item[0]] = attribute;
      return result;

    }, {});

  }();



  var conj_qwords = _.reduce([
    ['intersection', 'x'],
    ['union', '+'],
    ['nest', '/'],
    ['done', ';']
  ], function (result, item) {
    result[item[0]] = dragoman.qword(item[1]);
    return result;
  }, {});

  var closed_attr_qwords = _.filter(attr_qwords, function(attr_qword) {
    return !attr_qword.open;
  });

  var query_phrase_types = _.reduce([
    ['groups', function(position, prev_qwords) {
      if (position == 0) {
        return  _.flatten([conj_qwords.done, closed_attr_qwords]);
      } else {
        var ss = [
          closed_attr_qwords,
          [conj_qwords.done, conj_qwords.nest, conj_qwords.union, conj_qwords.intersection]
        ];
        return ss[position % 2];
      }
    }],
    ['filters', function(position, prev_qwords) {

      if (position == 0) {
        return  _.flatten([conj_qwords.done, closed_attr_qwords]);
      } else if (position % 3 == 0) {
        return closed_attr_qwords;
      } else if (position % 3 == 1) {
        var attr_qword = prev_qwords[prev_qwords.length - 1];
        return _.map(attr_qword.value_qwords(), function(qword) {
          return qword;
        });
      } else {
        return [conj_qwords.done, conj_qwords.union, conj_qwords.intersection];
      }

    }],

    ['preview', function(position, prev_qwords) {
      if (position == 0) {
        return _.toArray(attr_qwords);
      } else {
        return _.flatten([conj_qwords.done, _.toArray(attr_qwords)]);
      }

    }]

  ], function (result, item) {
    result[item[0]] = dragoman.query_phrase_type(item[0], item[1]);
    return result;
  }, {});


  /*
   * returns [dragoman.dir()...]
   * or returns [dragoman.message()...]
   */
  var get_org_content = function(org, parent_dir) {


    var filter_phrase = org.query.filters;
    var filt_qwords = filter_phrase.qwords.slice(0, filter_phrase.qwords.length - 1);
    var filt_messages = filtered_messages(filt_qwords);

    var path_qwords = org.query.groups.qwords;
    var level = parent_dir.level + 1;
    var _level_qwords = level_qwords(path_qwords, level);
    if (_level_qwords.length > 0) {
      //this level has dirs
      return level_dirs(_level_qwords, parent_dir, filt_messages);
    } else {
      //this level has leafs 
      var qwords = org.query.preview.qwords;
      var length = qwords.length;
      var preview_qwords = qwords.slice(0, length - 1);
      return leafs(parent_dir, filt_messages, preview_qwords); 
    }

  };

  var leafs = function(parent_dir, filt_messages, preview_qwords) {
    var pairs = parent_dir.all_pairs; 

    var dir_messages = pairs.length > 0 
      ? _.intersection.apply(_, _.map(pairs, function(pair) {
        return pair.messages(); 
      }))
      : _.toArray(messages);

    var _messages = _.intersection(dir_messages, filt_messages);

    return _.map(_messages, function(message) {
      return dragoman.leaf(preview_qwords, user, message);
    }); 
  };

  var level_qwords = function(path_qwords, level) {

    if (level <= 0) {
      console.log('error');
      return null;
    }

    var start = 0;
    var end = -1;
    var i = 0;

    while(i < level) {

      start = end + 1;
      var nest_index = _.indexOf(path_qwords, conj_qwords.nest, start);  
      if (nest_index < 0) {
        if (i == level - 1) {
          end = _.indexOf(path_qwords, conj_qwords.done);
        } else {
          return []; 
        }
      } else {
        end = nest_index;
      } 

      i = i + 1;

    }

    return path_qwords.slice(start, end);

  }


  /*
   * returns [dragoman.dir()...]
   * or returns [dragoman.message()...]
   */
  var level_dirs = function(_level_qwords, parent_dir, filt_messages) {

    var parent_pairs = parent_dir.all_pairs;
    
    if (_level_qwords.length < 0) {
      console.log('error');
      return null;
    }

    var _pair_groups = pair_groups(_level_qwords);
    var _filtered_pair_groups = _.filter(_pair_groups, function(pairs) {
      var all_pairs = _.flatten([parent_pairs, pairs]);
      var dir_messages = _.intersection.apply(_, _.map(all_pairs, function(pair) {
        return pair.messages(); 
      }));
      var messages = _.intersection(dir_messages, filt_messages);

      return messages.length > 0;
    });

    var _dirs = _.map(_filtered_pair_groups, function(pairs) {
      return dragoman.dir(pairs, parent_dir);
    });

    return _dirs;

     
  };

  var filtered_messages = function(qwords) {

    var index = _.lastIndexOf(qwords, conj_qwords.union);
    var back = qwords.slice(index + 1);
    var front = qwords.slice(0, index);

    if (index < 0) {
      return cross_filtered_messages(qwords);
    } else {
      return _.union(filtered_messages(front), cross_filtered_messages(back));
    };

  };

  var cross_filtered_messages = function(qwords) {

    var index = _.lastIndexOf(qwords, conj_qwords.intersection);
    var back = qwords.slice(index + 1);
    var front = qwords.slice(0, index);

    if (index < 0) {
      if (qwords.length > 0) {
        var attr_qword = qwords[0];
        var value_qword = qwords[1];
        return attr_qword.messages(value_qword.source);
      } else {
        return _.toArray(messages);
      }
    } else {

      var attr_qword = back[0];
      var value_qword = back[1];
      var back_messages = attr_qword.messages(value_qword.source);
      return _.intersection(cross_filtered_messages(front), back_messages);
    }

  };

  var pair_groups = function(qwords) {
    var l = qwords.length;
    if (l == 0) {
      console.log('error');
      return null;
    } 

    var index = _.lastIndexOf(qwords, conj_qwords.union); 
    if (index < 0) {
      return cross_pair_groups(qwords);
    } else {

      var first_qwords = qwords.slice(0, index);
      var last_qwords = qwords.slice(index + 1);

      return _.flatten([pair_groups(first_qwords), cross_pair_groups(last_qwords)], true);

    }

  };

  var cross_pair_groups = function(qwords) {
    var l = qwords.length;
    if (l == 0) {
      console.log('error');
      return null;
    } 

    var attr_qword = qwords[l - 1];
    var value_qwords = attr_qword.value_qwords();
    var av_groups = _.map(value_qwords, function(value_qword) {
      return [dragoman.attr_value_pair(attr_qword, value_qword)];
    }); 
    
    if (l == 1) {

      return av_groups;

    } else {

      var op = qwords[l - 2];
      if (op != conj_qwords.intersection) {
        console.log('error');
      }
      var other_qwords = qwords.slice(0, l - 2);
      var other_av_groups = cross_pair_groups(other_qwords);


      return _.flatten(
        _.map(other_av_groups, function(other_group) {
          return _.map(av_groups, function(group) {
            return _.union(other_group, group);
          });
        }), 
        true
      );



    }

  };

  var new_qwords = function(query_phrase_type, old_qwords, qword, position) {

    var start = old_qwords.slice(0, position);
    var length = old_qwords.length;

    if (qword != conj_qwords.done && position != length - 1) {

      if (query_phrase_type == query_phrase_types.filters && position % 3 == 0) {
        var next = query_phrase_type.selection(position + 1, _.flatten([start, qword]))[0];
        var end = old_qwords.slice(position + 2);
        return _.flatten([start, qword, next, end]);

      } else {
        var end = old_qwords.slice(position + 1);
        return _.flatten([start, qword, end]);
      }


    } else {
      var end = [];
      var word = qword;
      var pos = position + 1;

      while (word != conj_qwords.done) {

        end.push(word);
        var prev_qwords = _.flatten([start, end]);
        word = query_phrase_type.selection(pos, prev_qwords)[0];
        pos = pos + 1;

      }

      return _.flatten([start, end, conj_qwords.done]);
    }

  };


  return {
    protocols: protocols,
    attr_qwords: attr_qwords,
    conj_qwords: conj_qwords,
    query_phrase_types: query_phrase_types,
    get_org_content: get_org_content, 
    new_qwords: new_qwords,
    user: user
  };


}();
