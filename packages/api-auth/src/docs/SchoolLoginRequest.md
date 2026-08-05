
# SchoolLoginRequest


## Properties

Name | Type
------------ | -------------
`region` | string
`schulNr` | string
`passwort` | string

## Example

```typescript
import type { SchoolLoginRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "region": TH,
  "schulNr": 12345,
  "passwort": abc123de,
} satisfies SchoolLoginRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SchoolLoginRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


