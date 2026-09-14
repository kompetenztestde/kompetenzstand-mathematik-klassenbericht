
# JwtTokenSchoolResponseAllOfData


## Properties

Name | Type
------------ | -------------
`token` | string
`tokenExpiresIn` | number
`id` | number
`nr` | string
`name` | string
`region` | number

## Example

```typescript
import type { JwtTokenSchoolResponseAllOfData } from ''

// TODO: Update the object below with actual values
const example = {
  "token": null,
  "tokenExpiresIn": 28800,
  "id": 1234,
  "nr": 00XX01,
  "name": Musterschule,
  "region": 16,
} satisfies JwtTokenSchoolResponseAllOfData

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as JwtTokenSchoolResponseAllOfData
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


