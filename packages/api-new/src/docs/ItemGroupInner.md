
# ItemGroupInner


## Properties

Name | Type
------------ | -------------
`iqbId` | string
`name` | string
`position` | number
`parameters` | [ItemParameters](ItemParameters.md)
`descriptiveStatistics` | [ItemGroupInnerDescriptiveStatistics](ItemGroupInnerDescriptiveStatistics.md)

## Example

```typescript
import type { ItemGroupInner } from ''

// TODO: Update the object below with actual values
const example = {
  "iqbId": null,
  "name": null,
  "position": null,
  "parameters": null,
  "descriptiveStatistics": null,
} satisfies ItemGroupInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ItemGroupInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


