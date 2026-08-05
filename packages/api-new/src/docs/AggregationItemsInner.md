
# AggregationItemsInner


## Properties

Name | Type
------------ | -------------
`type` | string
`value` | string
`ktColumnName` | string
`includedIqbIds` | Array&lt;string&gt;
`descriptiveStatistics` | [AggregationItemsInnerDescriptiveStatistics](AggregationItemsInnerDescriptiveStatistics.md)

## Example

```typescript
import type { AggregationItemsInner } from ''

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "value": null,
  "ktColumnName": null,
  "includedIqbIds": null,
  "descriptiveStatistics": null,
} satisfies AggregationItemsInner

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AggregationItemsInner
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


