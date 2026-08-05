
# JwtTokenData


## Properties

Name | Type
------------ | -------------
`token` | string
`tokenExpiresIn` | number

## Example

```typescript
import type { JwtTokenData } from ''

// TODO: Update the object below with actual values
const example = {
  "token": null,
  "tokenExpiresIn": 28800,
} satisfies JwtTokenData

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as JwtTokenData
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


