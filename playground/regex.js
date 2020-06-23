



var markdown; // = window.markdownit


//
// Protect some markups before parsing
// and make some fixups
// text : text in markdown or textile
// ----------------------------------------------------------
String.prototype.PreMarkup = function() {
  return this
          // template specific
          .replace(/{{/g,"opendoublebrackets")
          .replace(/{%/g,"openbracketspercent")
          .replace(/}}/g,"closedoublebrackets")
          .replace(/%}/g,"closepercentbrackets")
          // prevent bug in textile.js
          .replace(/<"/g,"&lt;\"")
        ;
}
//
// Unprotect summe protected markups
// and make some html fixups
// html : text in html
// ----------------------------------------------------------
String.prototype.PostMarkup = function() {
  return this
          // template specific
          .replace(/opendoublebrackets/g,"{{")
          .replace(/closedoublebrackets/g,"}}")
          .replace(/openbracketspercent/g,"{%")
          .replace(/closepercentbrackets/g,"%}")
        ;
}

var vm = new Vue({
  el: '#app',
  data         : {
    test: '',
    search: '',
    error_regex: false,
    replace: '',
    prepost: 'markup',
    markup: 'markdown',
    show_code: true
  },
  computed: {
    // the result protect -> regex[markup] -> parse -> unprotect -> regex[html]
    result: function () {
      try {
        search = new RegExp(this.search,"gms");
        this.error_regex = false;
      } catch (error) {
        this.error_regex = true;
        return this.test;
      }
      // result will be returned at the end
      result = this.test;
      // replace if markup
      if (this.prepost=="markup") {
        result = result.replace(search, this.replace);
      }
      //protect
      result = result.PreMarkup();
      // parse
      if (this.markup == "markdown") {
        result = markdown.render(result)
      }
      else {
        result = textile.parse(result)
      }
      // unprotect
      result = result.PostMarkup()
      // replace if html
      if (this.prepost=="html"){
        result = result.replace(search, this.replace);
      }
      return result;
    },
    regex_json: function () {
      search_type = this.prepost=="html" ? "html" : this.markup;
      return JSON.stringify([{[search_type] : this.search,"replace": this.replace}], null, 2);
    }
  },
  created: function () {
    markdown = window.markdownit({
    html: true,
    linkify: false,
    typographer: false,
  });
  // add markdown-it-attrs extension
  markdown.use(markdownItAttrs);
  }
});

