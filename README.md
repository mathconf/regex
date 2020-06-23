# Mathconf regex.json

On www.mathconf.org the file `regex.json` is used to create "snippets".

## Format

`regex.json` contains an array of objects, each object has two elements:

```json
[
  {
    "<markup>": "<regex to search>",
    "replace": "<replacement string>"
  },
  ...
]
```

`<markup>` can be `html`, `textile` or `markdown` and determine at what moment of the parsing the replacement takes place.

## How it works

If `<markup>` is `textile` or `markdown` the replacement takes place **before** the source (markdown or textile) has been parsed to html.

If `<markup>` is `html` the replacement takes place **after** the source (markdown or textile) has been parsed to html. This is the most common case.

For example we can decide that `|text|{.red}` is replaced with `<span class="red">text</span>` by adding
```json
  {
    "markdown": "\\|([^|]+)\\|{\\.([^}]+)}",
    "replace": "<span class=\"$2\">$1</span>"
  }
```

In this example if we replace `markdown` by `html` and we parse with `markdown` it will not work because `{.red}` will be parsed before the replacements takes place. But if we parse with `textile` it will be ok because `|text|{.red}` will be preserved by the parser _(but is useless because in textile we can use `%(.red)text%` to obtain the same result)_.

## The playground

You can test how all this works on [the dedicated playground](playground).
