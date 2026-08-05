
# TestsInner


## Properties

Name | Type
------------ | -------------
`testId` | string
`year` | string
`name` | string
`nameLong` | string
`nameDisplay` | string
`subject` | string
`gradeLevel` | string
`booklet` | string
`region` | string
`regionId` | string

## Example

```typescript
import type { TestsInner } from ''

// TODO: Update the object below with actual values
const example = {
  "testId": null,
  "year": null,
  "name": null,
  "nameLong": null,
  "nameDisplay": null,
  "subject": null,
  "gradeLevel": null,
  "booklet": null,
  "region": null,
  "regionId": null,
} satisfies TestsInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TestsInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


