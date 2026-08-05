
# StudentLoginRequest


## Properties

Name | Type
------------ | -------------
`surveyId` | number
`loginPw` | string
`loginCode` | string

## Example

```typescript
import type { StudentLoginRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "surveyId": 302,
  "loginPw": KlassenPW,
  "loginCode": abc123de,
} satisfies StudentLoginRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as StudentLoginRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


