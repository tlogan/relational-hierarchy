dragoman.io = function(){





  var div = function() {
    return $('<div></div>');
  };
  var mod_height = '50px';
  var blue = '#88c';
  var green = '#9d9'; 
  var dk_gray = '#ccc';
  var gray = '#ddd';
  var blue_gray = '#eef';
  var white = '#fff';

  var panel = function(id) {
    return div().attr('id', id).attr('class', 'panel')
      .css('width', '400px')
      .css('height', '100%')
      .css('background-color', gray)
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
    ;
  };

  var panel_item = function(id) {
    return div().attr('id', id).attr('class', 'panel_item')
      .css('background-color', blue_gray)
      .css('border-bottom', '2px solid ' + dk_gray)
      .css('border-left', '2px solid ' + green)
    ;
  };

  var text_item = function(text) {
    return div() 
      .text(text)
    ;
  };

  var mod_text_item = function(text) {
    return div() 
      .text(text)
      .css('color', blue)
      .css('padding-top', '16px')
      .css('padding-left', '16px')
      .css('padding-bottom', '16px')
    ;
  };

  var table = function() {
    var t = $('<table></table>');
    t.populate = function(rows) {
      _.forEach(rows, function(cells) {
        t.append(
          tr().populate(cells)
        );
      });
      return t;
    };
    return t;
  };

  var tr = function() {
    var tr = $('<tr></tr>');
    tr.populate = function(cells) {
      _.forEach(cells, function(cell) {
        tr.append(
          td().append(cell)
        );
      });
      return tr;
    };
    return tr;
  };

  var td = function() {
    var td = $('<td></td>').css('color', blue);
    td.populate = function(cell) {
      _.forEach(cell, function(item) {
        td.append(item);
      });
      return td;
    };
    return td;
  };


  var mod_panel_item = function(id, text) {
    return panel_item(id)
      .css('cursor', 'pointer')
      .css('height', mod_height)
      .append(mod_text_item(text))
    ;
  };

  var text_input = function(value) {
    return $('<input type="text"/>')
      .attr('value', value)
      .css('font-size', 'inherit')
      .css('padding', '4px')
      .css('outline', 'none')
      .css('border', '1px solid ' + dk_gray)
      .focus(function() {
        $(this).css('border', '1px solid ' + green)
      })
      .blur(function() {
        $(this).css('border', '1px solid ' + dk_gray)
      })
    ;
  };

  var qword_div = function(qword, position, query_type) {

    var d = div() 
      .text(qword.text)
      .attr('id', [qword.id, position, query_type].join('-')) 
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
      .css('color', white)
      .css('background-color', dk_gray)
      .css('margin-left', '4px')
      .css('padding', '4px')
      .css('min-height', '19px')
      .css('min-width', '19px')
      .css('cursor', 'pointer')
      .click(function() {
        dragoman.state.change_qword_selection(position, query_type);
      })
    ;

    d.qword = qword;

    return d;

  };

  var qword_divs = function(phrase_type, qwords) {

    return _.map(qwords, function(qword, index) {
      return qword_div(qword, index, phrase_type);
    });
  };

  var table_text_item = function(text) {
    return text_item(text)
      .css('background-color', green)
      .css('color', white)
      .css('text-align', 'right')
      .css('padding', '4px');
  };

  var organization_item = function(org) {


    var rows = [

    ] 
    ;

    var rows = _.union(

      [ [ [table_text_item('name')], [text_input(org.name)] ] ],

      _.map(org.query, function(qwords, query_type) {
        return [ [table_text_item(query_type)], qword_divs(query_type, qwords) ];
      })

    );

    return panel_item('organization')
      .append(mod_text_item('message organization')
        .css('background-color', blue)
        .css('color', white)
      )
      .append(
        table().css('padding-left', '4px')
          .css('padding-top', '4px')
          .css('padding-bottom', '4px')
          .populate(rows)
      )
    ;
  };


  var org_panel = function(org) {
    var p = panel('organization')
      .append(organization_item(org));

    show_options = function(qword_selection) {

      var position = qword_selection.position;
      var type = qword_selection.query_type;
      var qwords = qword_selection.query_type;

      return p;
    };

    return p;
  };

  var body = $('body')
    .css('margin', 0);

  var io = function() {

    var i = $('#io')
      .css('font-family', 'sans-serif')
      .css('color', white)
      .css('background-color', dk_gray)
      .css('height', '100%')
      .append(div().attr('id', 'control_bar')
        .css('height', mod_height)
        .css('background-color', green)
      )
      .append(panel('anchor_panel'))

      ;

    i.remove_panels = function() {
      i.find('div.panel').each(function(index) {
        if (index > 0) {
          $(this).remove();
        }
      }); 
      return i;
    };

    i.add_panel = function(panel) {
      i.append(panel);
      return i;
    };


    return i;

  }();

  var anchor_panel = function() {
    var a = io.find('#anchor_panel');
    a.highlight = function(id) {

      a.find('div.panel_item').each(function(index) {
        var panel_item = $(this);
        if (panel_item.attr('id') == id) {
          panel_item.css('background-color', dk_gray);
        } else {
          panel_item.css('background-color', blue_gray);
        } 
      });
      return a;
    };
    return a;
  }();

  var on_foc_org_change = function(foc_org) {

    if (foc_org != null) {
      anchor_panel.highlight(foc_org.id);
    }
    
  };

  var edit_org_panel = null;

  var on_edit_org_change = function(edit_org) {

    io.remove_panels();
    if (edit_org != null) {
      edit_org_panel = org_panel(edit_org);
      io.add_panel(edit_org_panel);
    }
    
  };

  var on_new_org_change = function(new_org) {

    var id = new_org.id;
    anchor_panel.append(mod_panel_item(id, id)
      .click(function() {
        dragoman.state.create_new_organization()
      })
    );
    
  };

  var on_qword_selection_change = function(qword_selection) {
    if (edit_org_panel != null) {
      alert(JSON.stringify(qword_selection));
    } else {
      alert('yikes...');
    }
  };

  var handler = {
    on_new_org_change: on_new_org_change,
    on_foc_org_change: on_foc_org_change,
    on_edit_org_change: on_edit_org_change,
    on_qword_selection_change: on_qword_selection_change
  };

  var start = function() {

    dragoman.state.subscribe(handler);

  };


  return {
    start: start
  };

}();

