
# AggregationsGroupData


## Properties

Name | Type
------------ | -------------
`groupId` | number
`groupName` | string
`schoolForm` | string
`numberOfStudents` | number
`aggregations` | [Array&lt;AggregationItemsInner&gt;](AggregationItemsInner.md)

## Example

```typescript
import type { AggregationsGroupData } from ''

// TODO: Update the object below with actual values
const example = {
  "groupId": null,
  "groupName": null,
  "schoolForm": null,
  "numberOfStudents": null,
  "aggregations": null,
} satisfies AggregationsGroupData

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AggregationsGroupData
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


