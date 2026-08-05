
# Items


## Properties

Name | Type
------------ | -------------
`groupData` | [ItemsGroupData](ItemsGroupData.md)
`studentsData` | [Array&lt;ItemsStudentsDataInner&gt;](ItemsStudentsDataInner.md)

## Example

```typescript
import type { Items } from ''

// TODO: Update the object below with actual values
const example = {
  "groupData": null,
  "studentsData": null,
} satisfies Items

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Items
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


