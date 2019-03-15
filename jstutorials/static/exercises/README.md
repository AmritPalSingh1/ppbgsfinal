# How to create Exercises

Exercises are stored as a YAML file. They contain the task, hints for the task, starter html and js code, etc.

## YAML schema

```YAML
task: Task displayed at the top of the page (html string)
details: exercise details (html string)
hints: 1 or more hints for this task (array)
  - hintContent: The actual hint to display (html string)
    hintCost: the cost for this hint (number)
html: starter html code (string)
js: starter javascript code (string)
htmlReadOnly: disable html editor changes (boolean)
jsReadOnly: disable js editor changes (boolean)
secret: hidden javascript code executed before user code. does not share user code's scope (js string)
test:
  setup: hidden javascript code executed before user code. shared with user scope (js string)
  run: hidden javascript code ran after user code.
  cleanup: hidden javascript code ran after all other hidden code
  has: array of regex tests against user js code (array)
    - regex: the regex pattern (string)
      flags: regex flags. optional. (string)
      message: error message shown if pattern does not match (string)
  hasNot: regex tests against user js code (array)
    - regex: the regex pattern (string)
      flags: regex flags. optional. (string)
      message: error message shown if pattern does match (string)
  maxLines: the max number of javascript code the user should write (number)
  errorThreshold: to calculate user grade. (errorThreshold - errors) / errorThreshold = user grade (number)
```