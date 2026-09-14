
# ItemStatisticsInner


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`position` | number
`iqbId` | string
`exercise` | [Exercise](Exercise.md)
`parameters` | [ItemParameters](ItemParameters.md)
`descriptiveStatistics` | [DescriptiveStatisticsDescriptiveStatistics](DescriptiveStatisticsDescriptiveStatistics.md)

## Example

```typescript
import type { ItemStatisticsInner } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "position": null,
  "iqbId": null,
  "exercise": null,
  "parameters": null,
  "descriptiveStatistics": null,
} satisfies ItemStatisticsInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ItemStatisticsInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


