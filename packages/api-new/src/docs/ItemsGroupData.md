
# ItemsGroupData


## Properties

Name | Type
------------ | -------------
`groupId` | number
`groupName` | string
`schoolForm` | string
`items` | [Array&lt;ItemGroupInner&gt;](ItemGroupInner.md)

## Example

```typescript
import type { ItemsGroupData } from ''

// TODO: Update the object below with actual values
const example = {
  "groupId": null,
  "groupName": null,
  "schoolForm": null,
  "items": null,
} satisfies ItemsGroupData

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ItemsGroupData
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


