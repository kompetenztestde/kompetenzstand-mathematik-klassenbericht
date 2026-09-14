
# SchoolInformation


## Properties

Name | Type
------------ | -------------
`schoolName` | string
`schoolNumber` | string
`schoolId` | string
`schoolForm` | string

## Example

```typescript
import type { SchoolInformation } from ''

// TODO: Update the object below with actual values
const example = {
  "schoolName": null,
  "schoolNumber": null,
  "schoolId": null,
  "schoolForm": null,
} satisfies SchoolInformation

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SchoolInformation
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


