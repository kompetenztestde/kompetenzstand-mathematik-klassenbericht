
# JwtTokenUserResponse


## Properties

Name | Type
------------ | -------------
`success` | boolean
`message` | string
`data` | [JwtTokenUserResponseAllOfData](JwtTokenUserResponseAllOfData.md)

## Example

```typescript
import type { JwtTokenUserResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "success": true,
  "message": ,
  "data": null,
} satisfies JwtTokenUserResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as JwtTokenUserResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


