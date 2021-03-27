export const example = {
  "message": "Check file \u001b[35m/users/ortatherox/dev/typescript/repros/mui-slowness/src/react/pages/\u001b[36mmain.tsx\u001b[39m\u001b[35m\u001b[39m",
  "terseMessage": "Check file main.tsx",
  "type": "checkSourceFile",
  "children": [
    {
      "message": "Check deferred node from (line 42, char 13) to (line 54, char 20)",
      "terseMessage": "Check deferred node",
      "type": "checkDeferredNode",
      "children": [
        {
          "message": "Check expression from (line 42, char 19) to (line 42, char 40)",
          "terseMessage": "Check expression",
          "type": "checkExpression",
          "children": [
            // {}
          ],
          "start": {
            "file": "/users/ortatherox/dev/typescript/repros/mui-slowness/src/react/pages/main.tsx",
            "line": 42,
            "char": 19
          },
          "end": {
            "file": "/users/ortatherox/dev/typescript/repros/mui-slowness/src/react/pages/main.tsx",
            "line": 42,
            "char": 40
          },
          "time": "1383ms"
        }
      ],
      "start": {
        "file": "/users/ortatherox/dev/typescript/repros/mui-slowness/src/react/pages/main.tsx",
        "line": 42,
        "char": 13
      },
      "end": {
        "file": "/users/ortatherox/dev/typescript/repros/mui-slowness/src/react/pages/main.tsx",
        "line": 54,
        "char": 20
      },
      "time": "1470ms"
    }
  ],
  "start": {
    "file": "/users/ortatherox/dev/typescript/repros/mui-slowness/src/react/pages/main.tsx"
  },
  "time": "2076ms"
}
